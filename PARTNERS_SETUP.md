# Admin partner companies

Visit `/admin/settings` (Nastavení) and use the **Partnerské firmy** box below the social links. Click **Přidat firmu**, enter the company name and optionally its website, reorder with the arrows, remove with the bin icon, then click **Uložit firmy**. The footer of every page shows the list under **Spolupracujeme s** and updates immediately after saving. Names with a website open it in a new tab; names without one are shown as plain text. An empty list hides the section. Completely blank rows are ignored on save.

## Initial release

Deploy `firestore.rules` to project `marpro-f492a` using `firebase deploy --only firestore:rules --project marpro-f492a`, then publish the website code through its normal Git deployment. Until the rules are deployed, saving fails with a permission error.

The data is stored in `settings/partners` as `{ companies: [{ name, url }] }`. The rule allows only the `companies` list (max 50 entries) and denies deletion. Firestore rules cannot validate individual list items, so names and URLs are validated in the admin form before saving and re-validated in the footer before rendering (unsafe or malformed entries are skipped). This follows the same client-managed admin model as `settings/socialLinks`.
