import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RootEventPayload } from 'src/models/root-event-payload';
import getPolicyHolderId from 'src/utils/get-policyholder-id';

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

    async getPolicyHolder(rootEventPayload: RootEventPayload): Promise<any> {
      const policyholder_id = getPolicyHolderId(rootEventPayload)

      if (!policyholder_id) {
        return null
      }

      const url = `${process.env.ROOT_PLATFORM_API_URL}/v1/insurance/policyholders/${policyholder_id}`
      const res = await firstValueFrom(this.httpService.get(url, {
        headers: {
          'Authorization': `Bearer ${process.env.ROOT_PLATFORM_API_KEY}`,
        }

      })).catch((error) => {
        console.error(error.code, error.message)
        return null
      })

      return res?.data
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


/*
{

  "webhook_id": "18cf6b26-2493-4e7f-b187-793c96ec77dd",

  "environment": "sandbox",

  "verification_token": "12345ABCDE",

  "event": {

    "type": "policy_updated",

    "created_at": "2024-01-11T12:44:01.901Z",

    "metadata": {

      "requested_at": "2024-01-11T12:44:01.663Z",

      "requested_by": {

        "type": "user",

        "id": "e7914a84-2a43-11e9-aba7-3b100b403d3d"

      }

    },

    "package_name": "Funeral Cover: Main Member",

    "sum_assured": 5432100,

    "monthly_premium": 8859,

    "base_premium": 6891,

    "billing_amount": 8859,

    "end_date": "2025-01-11T00:00:00.000Z",

    "module": {

      "age": 30,

      "type": "root_funeral_currencies",

      "cover_amount": 5432100,

      "spouse_included": false,

      "children_included": false,

      "extended_family_included": false

    },

    "application_id": "433550b7-c629-44c5-9b07-28d87eaad9c2",

    "charges": [{

      "type": "fixed",

      "name": "Fixed Fee",

      "description": "Fixed Fee",

      "amount": 1000

    }, {

      "type": "variable",

      "name": "Variable Fee",

      "description": "Variable Fee",

      "amount": 0.1

    }, {

      "type": "balance",

      "name": "Balance",

      "description": "Balance"

    }],

    "billing_frequency": "monthly",

    "billing_month": null,

    "terms_uri": "https://staging-sandbox.root.co.za/v1/insurance/policies/07ce4f61-fa6a-443e-b498-af077c375d1b/terms/terms.pdf",

    "policy_id": "07ce4f61-fa6a-443e-b498-af077c375d1b",

    "requested_by": {

      "type": "user",

      "id": "e7914a84-2a43-11e9-aba7-3b100b403d3d"

    }

  },

  "policy": {

    "policy_id": "07ce4f61-fa6a-443e-b498-af077c375d1b",

    "scheme_type": "individual",

    "created_at": "2024-01-11T12:43:45.072Z",

    "created_by": {

      "type": "user",

      "id": "e7914a84-2a43-11e9-aba7-3b100b403d3d"

    },

    "policy_number": "D66958AF27",

    "policyholder_id": "eef2afef-2ed5-403b-8864-75760f6a873c",

    "package_name": "Funeral Cover: Main Member",

    "sum_assured": 5432100,

    "base_premium": 6891,

    "monthly_premium": 8859,

    "billing_amount": 8859,

    "billing_frequency": "monthly",

    "billing_month": null,

    "billing_day": 1,

    "next_billing_date": "2024-02-01T00:00:00.000Z",

    "next_collection_date": "2024-02-01T00:00:00.000Z",

    "start_date": "2024-01-11T12:43:45.507Z",

    "end_date": "2025-01-11T00:00:00.000Z",

    "cancelled_at": null,

    "reason_cancelled": null,

    "app_data": null,

    "module": {

      "age": 30,

      "type": "root_funeral_currencies",

      "cover_amount": 5432100,

      "spouse_included": false,

      "children_included": false,

      "extended_family_included": false

    },

    "product_module_id": "7c6bb968-0010-4d1d-8e8a-47549ca72e5f",

    "product_module_definition_id": "091a2468-2053-45f3-923b-ef6764d22b4c",

    "beneficiaries": [{

      "beneficiary_id": "cd054663-69fc-48c5-9192-754f9249e2d8",

      "policyholder_id": "eef2afef-2ed5-403b-8864-75760f6a873c",

      "percentage": 100,

      "relationship": "policyholder"

    }],

    "current_version": 4,

    "schedule_file_id": "7fde9dd4-0c4d-4d75-8de2-7b2b0c7a9738",

    "policy_schedule_uri": "https://staging-sandbox.root.co.za/v1/insurance/policies/07ce4f61-fa6a-443e-b498-af077c375d1b/schedule/schedule_latest.pdf",

    "schedule_versions": [{

      "version": 1,

      "created_at": "2024-01-11T12:43:48.053Z"

    }, {

      "version": 2,

      "created_at": "2024-01-11T12:43:48.626Z"

    }, {

      "version": 3,

      "created_at": "2024-01-11T12:43:49.152Z"

    }, {

      "version": 4,

      "created_at": "2024-01-11T12:43:49.638Z"

    }],

    "terms_file_id": "3e9ddeaf-bd35-4163-914d-cd0c573e60f9",

    "terms_uri": "https://staging-sandbox.root.co.za/v1/insurance/policies/07ce4f61-fa6a-443e-b498-af077c375d1b/terms/terms.pdf",

    "supplementary_terms_files": [],

    "policy_welcome_letter_file_id": "f9ce3d74-ff5b-4888-ab7f-356a627a745c",

    "policy_welcome_letter_uri": "https://staging-sandbox.root.co.za/v1/insurance/policies/07ce4f61-fa6a-443e-b498-af077c375d1b/welcome-letter/welcome_letter.pdf",

    "claim_ids": [],

    "complaint_ids": [],

    "status": "active",

    "balance": 0,

    "currency": "EUR",

    "payment_method_id": "efb9fc32-7de2-41ef-a3d3-2bcf8c024ca0",

    "status_updated_at": "2024-01-11T12:43:45.745Z",

    "updated_at": "2024-01-11T12:44:01.901Z",

    "covered_people": [],

    "application_id": "433550b7-c629-44c5-9b07-28d87eaad9c2",

    "charges": [{

      "type": "fixed",

      "name": "Fixed Fee",

      "description": "Fixed Fee",

      "amount": 1000

    }, {

      "type": "variable",

      "name": "Variable Fee",

      "description": "Variable Fee",

      "amount": 0.1

    }, {

      "type": "balance",

      "name": "Balance",

      "description": "Balance"

    }]

  }

}
*/