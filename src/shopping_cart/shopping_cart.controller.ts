import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/auth/enum/role.enum';

@Controller('shoppingcart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('')
  findOneShoppingCart(@Req() req) {
    return this.shoppingCartService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Patch('')
  updateShoppingCart(@Req() req, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(req.user.userId, updateShoppingCartDto);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Delete('/shoppingcart')
  remove(@Req() req) {
    return this.shoppingCartService.remove(req.user.userId);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Delete('/shoppingcart/:id')
  removeForUser(@Param('id') id: string) {
    return this.shoppingCartService.remove(id);
  }
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Patch('/shoppingcart/users/:id')
  updateShoppingCartForUser(@Param('id') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(id, updateShoppingCartDto);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('/shoppingcart/:id')
  findOneShoppingCartForUser(@Param('id') id: string) {
    return this.shoppingCartService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Get('/shoppingcart')
  findAllShoppingCart() {
    return this.shoppingCartService.findAll();
  }
}
