import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RootPlatformService {
    constructor(private readonly httpService: HttpService) {
    }

    async removeWebhooks(): Promise<void> {
      const url = `${process.env.ROOT_PLATFORM_API_URL}/v1/insurance/webhooks`
      const webhookIds = []
        for (const id of webhookIds) {
            const deleteUrl = `${url}/${id}`
            await firstValueFrom(this.httpService.delete(deleteUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.ROOT_PLATFORM_API_KEY}`,
                }
            })).catch((error) => {
                console.error(error.code, error.message)
                return null
            })
        }
    }

  async createWebhook(): Promise<AxiosResponse> {
    const url = `${process.env.ROOT_PLATFORM_API_URL}/v1/insurance/webhooks/${process.env.ROOT_PLATFORM_WEBHOOK_ID}`
    const data = {
      name: 'my-webhook',
      description: 'my webhook description',
      verification_token: process.env.ROOT_PLATFORM_WEBHOOK_VERIFICATION_TOKEN,
      url: `${process.env.SERVICE_URL}/rootPlatformEvent`,
      subscriptions: ['policy_issued', 'policy_updated', 'policy_cancelled', 'policyholder_updated', 'policy_expired']
    }

    const res = await firstValueFrom(this.httpService.patch(url, data, {
      headers: {
        'Authorization': `Bearer ${process.env.ROOT_PLATFORM_API_KEY}`,
      }

    })).catch((error) => {
      console.error(error.code, error.message)
      return null
    })

    return res
  }
}
