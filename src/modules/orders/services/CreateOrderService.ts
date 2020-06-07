import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // Find a Customer
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Customer Not Found');
    }
    // Find ids in array
    const productsID = products.map(product => {
      return { id: product.id };
    });
    console.log('chegou no map', productsID);

    // Find all ID products into repository

    const productsSelectted = await this.productsRepository.findAllById(
      productsID,
    );
    console.log('chegou na seleção', productsSelectted);

    if (productsSelectted.length !== products.length) {
      throw new AppError('Product is missing');
    }
    // Format products in array
    const productsFormatted = productsSelectted.map(product => {
      // find ids in list of Products
      const productList = products.find(pFind => pFind.id === product.id);
      if (!productList) {
        throw new AppError('Product not found');
      }
      // Verify quantity
      if (product.quantity < productList.quantity) {
        throw new AppError('Product out of stock');
      }
      // Return Array formatted
      return {
        product_id: product.id,
        price: product.price,
        quantity: productList?.quantity || 0,
      };
    });
    // Save Order
    const order = await this.ordersRepository.create({
      customer,
      products: productsFormatted,
    });

    // Update Quantity
    await this.productsRepository.updateQuantity(products);

    // Return order
    return order;
  }
}

export default CreateProductService;
