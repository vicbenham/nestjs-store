import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MerchantRegisteredEvent } from './events/merchants-registered.event';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private logger = new Logger(AuthService.name);

  async register(dto: RegisterDto) {
    this.logger.log(`Register called with`, dto);

    const existing = await this.prisma.merchant.findUnique({
      where: { email: dto.email },
    });
    this.logger.log(`Existing`, existing);

    if (existing) {
      throw new ConflictException(`Email already in use`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    this.logger.log(`Password hashed`);

    const merchant = await this.prisma.merchant.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });
    this.logger.log(`Merchant created`, merchant);

    this.eventEmitter.emit(
      'merchant.registered',
      new MerchantRegisteredEvent(merchant.id, merchant.email, merchant.name),
    );

    return {
      message: 'Merchant registered successfully',
      merchant: {
        id: merchant.id,
        email: merchant.email,
        name: merchant.name,
      },
    };
  }
}
