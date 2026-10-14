# QuickBite — Online Food Delivery System
### Software Engineering & UML Activity Diagram Interactive Demonstration Prototype

A responsive web application built with **React, TypeScript, Vite, and Tailwind CSS** to demonstrate how an **UML Activity Diagram represents a real software application's operational workflow**, including actions, decisions, guarded branches, retry loops, order cancellation, and lifecycle completion.

---

## 🌟 Key Highlights & UML Alignment

| UML Element | QuickBite Real-World Implementation |
|---|---|
| **Initial Node (●)** | Starting state when the customer opens the app. |
| **Action Node** | *Browse Menu*, *Add to Cart*, *Review Cart*, *Enter Delivery Details*, *Process Payment*. |
| **Decision Node (◇)** | 1. `[Is Cart Empty?]` &rarr; `[Yes]` (loops back to browse) vs `[No]` (proceeds to checkout).<br/>2. `[Was Payment Successful?]` &rarr; `[Success]` vs `[Failure]`. |
| **Guard Conditions** | Explicit criteria enclosed in brackets: `[Yes]`, `[No]`, `[Success]`, `[Failure]`, `[Eligible for Cancellation]`. |
| **Control Loop / Retry** | Failed payment offers **Retry Payment** returning control back to payment processing without duplicate orders. |
| **Order Cancellation** | Guarded branch allowed only during initial states (`Placed` or `Confirmed`), locked once cooking/dispatched. |
| **Activity Final Node (⦿)** | Order fulfilled (`Delivered`) or cleanly terminated (`Cancelled`). |

---

## 💻 Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 6
- **Styling:** Tailwind CSS v4 + Plus Jakarta Sans & Outfit typography
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Testing:** Vitest + Testing Library (13 automated test suites)

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in any browser.

### 3. Run Automated UML Workflow Verification Tests
```bash
npx vitest run --environment jsdom
```

### 4. Build for Production
```bash
npm run build
```

---

## 🎙️ Recommended 90-Second Presentation Sequence

1. **Initial Node & Menu Browsing:** Point to the live UML Activity panel on the right highlighting the **Initial Node (●)**. Browse the categories (Pizza, Burgers, Indian, Snacks, Beverages) with prices in Indian Rupees (₹).
2. **Demonstrate Guard Condition [Cart Empty? = YES]:** Open Cart without adding items and click *Proceed to Checkout*. Show the alert explaining how the guard condition intercepts empty-cart checkouts and redirects back to browsing.
3. **Add Items & Quick Checkout:** Add *Margherita Basil Delight* and *Royal Hyderabadi Dum Biryani*. Click *Review Cart* &rarr; *Proceed to Checkout*. Click **Pre-fill Sample Data** for instant form validation.
4. **Demonstrate Payment Failure Branch & Retry Loop:** On the Demo Payment page, select **Simulate FAILED Payment** &rarr; click *Execute Demo Payment*. Show the failure screen and UML decision node `[Retry Payment?]`. Click **Retry Payment** to demonstrate the backward control loop.
5. **Demonstrate Payment Success Branch:** Select **Simulate SUCCESSFUL Payment** &rarr; click *Execute Demo Payment*. Note the unique generated demo Order ID (e.g. `QB-XXXXXX`), `PAID` status, and confetti celebration.
6. **Order Lifecycle Stepper:** Click **Track Simulated Order Lifecycle**. Use the **Advance Demo Status** button to manually step:
   `Placed` &rarr; `Confirmed` &rarr; `Preparing` &rarr; `Out for Delivery` &rarr; `Delivered (⦿)`.
7. **Guarded Cancellation Rule:** Note that cancellation is enabled only while `Placed` or `Confirmed`, and disabled once food is in the kitchen.
8. **Reset Demo:** Click the **Reset Demo** button in the header navbar to return to a clean slate.

---

## 🛡️ Simulated Features & Academic Transparency

- **Payments:** Payment processing is simulated with explicit success/failure options for academic presentation. No real payment gateways or credit cards are involved.
- **Logistics & Delivery:** Order tracking is simulated with a manual step controller (**Advance Demo Status**) so the student presenter can demonstrate state transitions at their own pace.
- **Persistence:** Prototype data uses `localStorage` with in-memory fallbacks.

---

## 🌐 Public Deployment (Optional)

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Run `npm run build`
2. Drag and drop the `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop)
