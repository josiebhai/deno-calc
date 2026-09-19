import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "./firebase";

export type AnalyticsEvent =
  | { name: "count_started"; params?: { currency_code?: string } }
  | { name: "currency_changed"; params: { currency_code: string } }
  | { name: "org_name_entered" }
  | { name: "service_name_entered" }
  | {
      name: "share_link_created";
      params: {
        currency_code: string;
        total_denomination_count: number;
        has_org_name: boolean;
        has_service_name: boolean;
      };
    }
  | { name: "whatsapp_share_clicked" }
  | { name: "generic_share_clicked" }
  | { name: "copy_link_clicked" }
  | { name: "share_link_viewed"; params: { valid: boolean } }
  | { name: "csv_exported" };

export async function track(event: AnalyticsEvent): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance();
    if (!analytics) return;
    logEvent(analytics, event.name, "params" in event ? event.params : undefined);
  } catch {
    // Analytics failures should never break the app.
  }
}
