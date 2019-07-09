# ReactiveAddons

This project is a proposal for a set of basic angular extensinos to
create a fully reactive Angular application without hacks and workarounds.

Things suggested:
- push pipe (a pipe similar to async pipe but triggers detectChanges instead of markForCheck)
- let (a directive that enables multiple "o$ | async as varName" bindings on one element)
- reactiveLifeCycleHooks
- fromViewEvent (like fromEvent but it triggers change detection when events are fired)
