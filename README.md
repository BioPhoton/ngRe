# ReactiveAddons

This project is a proposal for a set of basic angular extensinos to
create a fully reactive Angular application without hacks and workarounds.

Things suggested:
- +++ push pipe (a pipe similar to async pipe but triggers detectChanges instead of markForCheck)
- +++ observable life cycle hooks
- ++ multi let directive (a directive that enables multiple "o$ | async as varName" bindings on one element)
- + change detection class decorator (depending on future experiments we might need a way to tweet change detection by hook)
- ~ local state management (a very reduced state management fully composed over observables)
