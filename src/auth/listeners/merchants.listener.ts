import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MerchantRegisteredEvent } from '../events/merchants-registered.event';
import { MailService } from '../../services/mails.services';

@Injectable()
export class MerchantListener {
  constructor(private readonly mailService: MailService) {}

  private logger = new Logger(MerchantListener.name);

  @OnEvent('merchant.registered')
  async handleMerchantRegistered(event: MerchantRegisteredEvent) {
    this.logger.log(
      `New merchant registered: id=${event.merchantId}, email=${event.email}, name=${event.name}`,
    );

    await this.mailService.sendNewMerchantNotification(event.name, event.email);
    this.logger.log(`Notification sent to ${process.env.MAIL_USER}`);
  }
}
