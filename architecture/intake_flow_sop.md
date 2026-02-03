# SOP: 6-Step Insurance Intake Flow

## ?? Goal
Capture comprehensive Auto & Home insurance data through a premium, frictionless 6-step guided experience.

## ??? Step Definition

### Step 1: Personal Profile (Contact)
- **Fields**: First Name, Last Name, Email, Phone.
- **Validation**: All fields required. Email and Phone format validation.
- **Logic**: Check if contact already exists in GHL (handled via Webhook on submission).

### Step 2: Current Status (Discovery)
- **Fields**: Current Carrier, Expiration Date, Interest (Auto/Home).
- **Validation**: Expiration date must be future-dated or "Not Insured".
- **Logic**: Determines if Step 3 (Auto) or Step 5 (Home) is shown.

### Step 3: Vehicle Inventory (Dynamic)
- **Fields**: Year, Make, Model, VIN (Optional).
- **Limit**: Max 4 vehicles.
- **UX**: Card-based interface with "Add Another" button.

### Step 4: Driver Profiles (Dynamic)
- **Fields**: First Name, Last Name, Birth Date, License State.
- **Limit**: Max 4 drivers.
- **UX**: Card-based interface with "Add Another" button.

### Step 5: Home Property (Conditional)
- **Fields**: Address (if different), Home Type, Year Built, Sq Ft.
- **Logic**: Only shown if "Home" interest was selected in Step 2.

### Step 6: Review & Submit
- **Display**: Summarized payload of all data captured.
- **Action**: Submit button triggers the Link Layer (GHL Webhook + Supabase).
- **Feedback**: Premium "Success" animation and redirection instructions.

## ?? Submission Pipeline
1. **Frontend**: Validates local state.
2. **Link 1 (GHL)**: Send payload to webhook. Apply tags: `Auto-Interest`, `Home-Interest`.
3. **Link 2 (Supabase)**: Parallel write to `leads` table for redundancy.
4. **Navigation**: Redirect to thank-you page.

## ?? Edge Cases & Healing
- **Schema Drift**: All tools must strictly follow the `gemini.md` schema.
- **Connection Loss**: Store progress in `localStorage` for session recovery.
- **Failed Submission**: Retry logic for GHL webhook (3 attempts).
