import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // const productsList = await this.ormRepository.findByIds(products);
    // console.log('products find by id no repositório', products);
    const productsID = products.map(product => product.id);
    // console.log('products após o map no repositório', productsID);
    const productsList = await this.ormRepository.find({
      id: In(productsID),
    });
    return productsList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsItems = await this.findAllById(products);
    const productsUpdatted = productsItems.map(product => {
      const productsFound = products.find(p => p.id === product.id);
      // IF Not found products
      if (!productsFound) {
        return product;
      }
      const productToUpdate = product;

      productToUpdate.quantity -= productsFound.quantity;
      return productToUpdate;
    });
    await this.ormRepository.save(productsUpdatted);
    return productsUpdatted;
  }
}

export default ProductsRepository;
