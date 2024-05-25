import { Author } from "src/auth/entities/user.entity";
import { usersMap } from "./users.data";
import {v4 as uuid} from "uuid";

const preAuthors = [    
    {
        penName: "George R.R. Martin",
        biography: "George R.R. Martin es el autor de «Canción de hielo y fuego», la saga que inspiró la popular serie de HBO: Juego de tronos. Martin vendió su primer relato en 1971 y desde entonces se ha dedicado profesionalmente a la escritura. En las novelas Muerte de la luz (1979), Refugio del viento (1988), Sueño del Fevre (1983), The Armageddon Rag (1983) o Los viajes de Tuf (1988) cultivó la fantasía, el terror o la ciencia ficción, géneros que también exploró en sus numerosos relatos, recogidos en los volúmenes Una canción para Lya (1982) o Canciones que cantan los muertos (1986). En la década de los ochenta, trabajó como guionista y productor en Hollywood, pero a mediados de los noventa volvió a la narrativa e inició la aclamadísima saga de fantasía épica por la que es mundialmente conocido. Por el momento ha publicado cinco entregas: Juego de tronos, Choque de reyes, Tormenta de espadas, Festín de cuervos y Danza de dragones.",
        booksWritten: [],
        userId: usersMap["gMartin"].id,
    },
    {
        penName: "J.K. Rowling",
        biography: "J.K. Rowling es la autora de los eternamente populares libros de Harry Potter. Después de que la idea de Harry Potter llegara a ella en un viaje de tren con retrasos en 1990, planeó y comenzó a escribir la serie de siete libros. El primero, Harry Potter y la piedra filosofal, fue publicado en Reino Unido en 1997. Le tomó otros diez años completar la saga, la cual concluyó en 2007 con la publicación de Harry Potter y las reliquias de la muerte.\n\nPara ampliar la serie, J. K. Rowling escribió tres libros cortos complementarios para la caridad, Quidditch a través de los tiempos y Animales fantásticos y dónde encontrarlos, en apoyo a Comic Relief y Lumos, y Los cuentos de Beedle el Bardo, en apoyo a Lumos. También colaboró en la escritura de una obra de teatro, Harry Potter y el legado maldito, la cual fue publicada como guion.\n\nSus otros libros infantiles incluyen el cuento de hadas El Ickabog y El cerdito de Navidad, los cuales fueron publicados en 2020 y 2021, respectivamente, convirtiéndose en bestsellers. Además, es autora de libros para adultos, incluyendo la serie bestseller de ficción de crimen escrita bajo el seudónimo Robert Galbraith.        \n\nJ. K. Rowling ha recibido muchos premios y honores por su escritura. También apoya a numerosas causas humanitarias a través de su fundación benéfica Volant y es fundadora de Lumos, una caridad a favor de la infancia.",
        booksWritten: [],
        userId: usersMap["jRowling"].id,
    },
    {
        penName: "J.R.R. Tolkien",
        biography: "John Ronald Reuel Tolkien es el autor detrás del Legendarium, un compendio que inmortaliza la historia de la Tierra Media. Fue un escritor, poeta, filólogo, lingüista y profesor universitario británico nacido en el desaparecido Orange al sur de África. Entre sus obras destacan El hobbit, El Silmarillion y El Señor de los Anillos, esta última vendió mas de 150 millones de copias en más de 40 lenguajes. ",
        booksWritten: [],
        userId: usersMap["jTolkien"].id,
    },
    {
        penName: "Miguel de Cervantes",
        biography: "Miguel de Cervantes (1547-1616) ejerció las más variadas profesiones antes de dedicarse plenamente a la literatura. Entró en Roma al servicio del cardenal Acquaviva, fue soldado en la batalla de Lepanto (1571), estuvo cinco años cautivo en Argel y ejerció como comisario real de abastos para la Armada Invencible. Tales oficios le reportaron una experiencia humana que supo plasmar magistralmente en todas sus obras.\n\nDe su producción poética cabe destacar Viaje del Parnaso (1614), un verdadero testamento literario y espiritual. En el campo teatral cultivó la tragedia, la tragicomedia, la comedia y el entremés. Pero sin duda es en el terreno de la narrativa donde Cervantes se impuso a sus contemporáneos y obtuvo logros que le valdrían el título de creador de la novela moderna, con libros como La Galatea (1585), El ingenioso hidalgo don Quijote de la Mancha (1605), Novelas ejemplares (1613), El ingenioso caballero don Quijote de la Mancha (segunda parte de su obra cumbre, 1615) y, póstumamente, Los trabajos de Persiles y Sigismunda (1617).",
        booksWritten: [],
        userId: usersMap["mCervantes"].id
    },
    {
        penName: "Stephen King",
        biography: "Stephen King es autor de más de sesenta libros, todos ellos best sellers internacionales. Sus títulos más recientes son Si te gusta la oscuridad, Holly, Cuento de hadas, Billy Summers , Después, La sangre manda, El Instituto , Elevación, El visitante (cuya adaptación audiovisual se estrenó en MAX en enero de 2020), La caja de botones de Gwendy (con Richard Chizmar), Bellas durmientes (con su hijo Owen King), El bazar de los malos sueños y la trilogía Bill Hodges (Mr. Mercedes, Quien pierde paga y Fin de guardia). La novela 22/11/63 (convertida en serie de televisión en Hulu) fue elegida por The New York Times Book Review como una de las diez mejores novelas de 2011 y por Los Angeles Times como la mejor novela de intriga del año. Los libros de la serie La Torre Oscura e It han sido adaptados al cine, junto con parte de sus clásicos, como Misery, El resplandor, Carrie, El juego de Gerald y La zona muerta.",
        booksWritten: [],
        userId: usersMap["sKing"].id
    },
    {
        penName: "Frank Herbert",
        biography: "Frank Patrick Herbert nació en Tacoma, Washington (1920). Antes de comenzar a escribir ciencia ficción, tuvo varias profesiones, desde fotógrafo y cámara de televisión a pescador de ostras. En 1965 presenta la serie de libros «Las crónicas de Dune», con gran éxito de la crítica y del público, donde describe un mundo imaginario con su propia política, ecología y estructura social. La primera obra de la saga, Dune, tuvo un grandísimo éxito por parte del público y de la crítica y obtuvo los premios Nébula y Hugo, además del Premio Internacional de Fantasía, que compartió con El señor de las moscas de William Golding. Falleció en el 11 de febrero de 1986.",
        booksWritten: [],
        userId: usersMap["fHerbert"].id
    },
]

const authors: Author[] = preAuthors.map((author) => {return {id: uuid(), ...author}})
const authorsMap = Object.fromEntries(authors.map((author) => {return [author.penName, author]}));

export {authorsMap};
export default authors;