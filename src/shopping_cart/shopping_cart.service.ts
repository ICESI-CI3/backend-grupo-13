import { Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EbooksService } from 'src/ebooks/ebooks.service';
import { AuthService } from 'src/auth/auth.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class ShoppingCartService {

  constructor(@InjectRepository(ShoppingCart)
  private readonly shoppingCartRepository: Repository<ShoppingCart>,
  @Inject(forwardRef(() => EbooksService))
  private readonly ebookService: EbooksService,
  @Inject(forwardRef(() => OrderService))
  private readonly orderService: OrderService,
  ){}
  
  
  async createShoppingCart(userId: string): Promise<ShoppingCart> {
    const shoppingCart = this.shoppingCartRepository.create({ user: { id: userId } });
    return await this.shoppingCartRepository.save(shoppingCart);
  }

  async findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find({ relations: ['user', 'ebooks'] });
  }


  async findOne(id: string): Promise<ShoppingCart> {
    const shoppingCart = await this.shoppingCartRepository.findOne({ where: { id }, relations: ['user','ebooks'] });
    if (!shoppingCart) {
      throw new NotFoundException('Shopping Cart not found');
    }
    return shoppingCart;
  } 
  async findByUserId(userId: string): Promise<ShoppingCart> {
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: {
        user: { id: userId }
      },
      relations: ['user', 'ebooks'], 
    });

    if (!shoppingCart) {
      throw new NotFoundException('Shopping cart not found for user');
    }

    return shoppingCart;
  }
  
  async update(userId: string, updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    const { ebookIds, operation } = updateShoppingCartDto;

    const shoppingCart = await this.findByUserId(userId);
    const ebooks = await this.ebookService.findBy(ebookIds);

    if (ebooks.length !== ebookIds.length) {
      throw new NotFoundException('One or more eBooks not found');
    }

    if (operation === 'add') {
      shoppingCart.ebooks = [...shoppingCart.ebooks, ...ebooks];
    } else if (operation === 'remove') {
      shoppingCart.ebooks = shoppingCart.ebooks.filter(ebook => !ebookIds.includes(ebook.id));
    } else {
      throw new Error('Invalid operation');
    }

    return this.shoppingCartRepository.save(shoppingCart);
  }

  async remove(id: string): Promise<void> {
    try {
      const shoppingCart = await this.findByUserId(id);
            if (!shoppingCart) {
        throw new NotFoundException('Shopping Cart not found');
      }

      shoppingCart.ebooks = [];
      await this.shoppingCartRepository.save(shoppingCart);
    } catch (error) {
      throw new InternalServerErrorException('Error emptying shopping cart');
    }
  }
  async buy(userId: string):Promise<String>{
    return await this.orderService.buy(userId,await this.findByUserId(userId));
  }
}
