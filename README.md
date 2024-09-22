# Reactive

**Simple and Powerful Signal implementation for React**

*Solutition uses [reactive package](https://www.npmjs.com/package/@dmytromykhailiuk/reactive) under the hood

## Installation

```sh
npm i @dmytromykhailiuk/reactive-react
```

## Basic example of usage

```typescript
import { useSignal, useComputedSignal, useSignalEffect, useDebouncedSignalEffect } from '@dmytromykhailiuk/reactive-react';

const a = useSignal(1);
const b = useSignal(2);
const c = useComputedSignal(() => a.value + b.value);

console.log('ComputedSignal', c.value); 
// ComputedSignal 3

a.value = a.value + 1;
b.value = b.value + 2;
console.log('ComputedSignal', c.value); 
// ComputedSignal 6

const effect = useSignalEffect(() => console.log('SignalEffect', c.value));
// SignalEffect 6

a.value = a.value + 1;
// SignalEffect 7
a.value = a.value + 1;
// SignalEffect 8
b.value = b.value + 2;
// SignalEffect 10
b.value = b.value;

effect.destroy();

const debouncedEffect = new useDebouncedSignalEffect(() => console.log('DebouncedSignalEffect', c.value));
// DebouncedSignalEffect 10

a.value = a.value + 1;
a.value = a.value + 1;
b.value = b.value + 2;


// DebouncedSignalEffect 14

```

**IMPORTANT: changing the signal value dosn't trigger component update**

**For component update we need to use useComponentUpdateWithSignal hook**

## Example of useComponentUpdateWithSignal usage

```typescript
import { useCallback } from 'react';
import { useSignal, useComputedSignal, useComponentUpdateWithSignal } from '@dmytromykhailiuk/reactive-react';

const ExampleComponent = () => {
  const firstSignal = useSignal(0);
  const secontSignal = useSignal(0);

  const computedSignal = useComputedSignal(() => firstSignal.value + secontSignal.value);

  useComponentUpdateWithSignal(computedSignal);

  const inscreaseSignalValue = useCallback((signal) => {
    signal.value = signal.value + 1;
  }, []);

  const inscreaseFirstSignalValue = useMemo(() => inscreaseSignalValue.bind(null, firstSignal), []);
  const inscreaseSecondSignalValue = useMemo(() => inscreaseSignalValue.bind(null, secontSignal), []);

  return <>
    <div>computedSignal - {computedSignal.value} </div>
    <button click={inscreaseFirstSignalValue}>increase first signal</button>
    <button click={inscreaseSecondSignalValue}>increase second signal</button>
  </div>
}

```
