import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';

export function mapToAttendeesWithSelectionFiltered() {
  return pipe(
    map(([all, ids, showAll, filters]) => {

      if (!(all && ids)) {
        return undefined;
      }

      let withSelectedState = all
        .map(a => ({...a, selected: ids.includes(a.id)}));

      const filterKeysSet = Object.keys(filters)
        .filter(filterProp => filters[filterProp] === true);

      if (filterKeysSet.length) {
        withSelectedState = withSelectedState.filter(
          i => {
            const isItemPropFalse = filterKeysSet
              .some(filterProp => i[filterProp] === false);
            return !isItemPropFalse;
          }
        );
      }

      const visibleItems = showAll ? withSelectedState : withSelectedState.slice(0, 10);

      return visibleItems;
    })
  );
}
