export interface LeadForms {
  count: number;
  offset: number;
  limit: number;
  items: LeadsItem[];
}

export interface LeadsItem {
  id: string;
  name: string;
  created: string;
  updated: string;
  leads_count: number;
  ad_plans_count: number;
  ad_plan_ids: number[];
  ad_group_ids: number[];
  banner_ids: number[];
  status: number;
  notification_actions: string[];
  logo: LeadsItemLogo;
}

export interface LeadsItemLogo {
  variants: LeadsItemLogoVariants;
  id: string;
}

export interface LeadsItemLogoVariants {
  '112x112': string;
  '256x256': string;
  '56x56': string;
  original: string;
}
