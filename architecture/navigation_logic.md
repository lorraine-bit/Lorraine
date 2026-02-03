# Layer 2: Navigation Logic

## ?? Routing Controller
The "Navigator" manages the flow between steps defined in the Layer 1 SOP.

### 1. State Management
- **Current Step**: Integer (1-6).
- **History Stack**: Tracks visited steps for backward navigation.
- **Payload Object**: Accumulates data from each step.

### 2. Decision Matrix
| Condition | Action |
|-----------|--------|
| Flow Start | Initialize Step 1 |
| Step 2 Selected "Auto" | Enable Step 3 & 4 |
| Step 2 Selected "Home" | Enable Step 5 |
| Dynamic Limit Reached | Disable "Add Another" (Max 4) |
| Validation Fails | Trigger Shake Animation & Prevent Navigation |
| Review Complete | Dispatch to Layer 3 (Tools) |

### 3. Transition Logic
- **Forward**: `validate() -> saveState() -> nextStep()`
- **Backward**: `prevStep() -> restoreState()`
- **Visuals**: Slide-in transitions (R-to-L) to maintain spatial awareness.

### 4. Persistence
- **Auto-Save**: Write `Payload Object` to `localStorage` on every `nextStep()` call.
- **Resume**: On page load, check `localStorage`. If exists, prompt to "Continue" or "Restart".
