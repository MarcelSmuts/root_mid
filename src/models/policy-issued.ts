export default interface PolicyIssued {
  event: {
    type: string;
    created_at: string;
    metadata: {
      requestedAt: string;
      requestedBy: {
        type: string;
        id: string;
      };
    };
    policy_number: string;
    package_name: string;
    sum_assured: number;
    monthly_premium: number;
    base_premium: number;
    billing_frequency: string;
    billing_amount: number;
    billing_day: number;
    beneficiaries: [
      {
        beneficiaryId: string;
        policyId: string;
        policyholderId: string;
        percentage: number;
        relationship: string;
      }
    ];
    start_date: string;
    end_date: string;
    module: {
      age: number
      type: string
      gender: string
      cover_amount: number
      spouse_included: boolean
      children_included: boolean
      extended_family_included: boolean
    }
    application_id: string;
    policyholder_id: string;
    scheme_type: string;
    currency: string;
    product_module_id: string;
    product_module_definition_id: string;
    charges: [];
    claim_ids: [];
    complaint_ids: [];
    terms_uri: string;
    policy_id: string;
    requested_by: {
      type: string;
      id: string;
    };
  }
}