import { ComputedSignal, DebouncedSignalEffect, Signal, SignalEffect } from '@dmytromykhailiuk/reactive';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useSignal = <T = any>(value: T, deeps = []): Signal<T> => {
  const signal = useMemo(() => new Signal(value), deeps);
  const prevSignalInstance = useRef(signal);
  const subscribers = useMemo(() => signal.__subscribers__, []);
  const observers = useRef(signal.__observers__);

  useEffect(() => {
    if (signal.__subscribers__ !== subscribers) {
      signal.__subscribers__ = subscribers;
      const observersArray = Array.from(observers.current);
      observersArray.forEach((observer) => observer.addDependency(signal));
      signal.__observers__ = new Set(observersArray);
      observers.current = signal.__observers__;
      signal.trigger();
    }
  }, [signal, subscribers, observers]);

  useEffect(
    () => () => {
      prevSignalInstance.current.destroy({ replaceSubscriptions: true });
      prevSignalInstance.current = signal;
    },
    [signal],
  );

  useEffect(
    () => () => {
      prevSignalInstance.current.destroy();
      signal.destroy();
    },
    [],
  );

  return signal;
};

export const useComputedSignal = <T = any>(callback: () => T, deeps = []): ComputedSignal<T> => {
  const computed = useMemo(
    () =>
      new ComputedSignal<T>(
        callback,
        deeps.filter((object) => object instanceof Signal || object instanceof ComputedSignal),
      ),
    deeps,
  );
  const prevComputedInstance = useRef(computed);
  const subscribers = useMemo(() => computed.__subscribers__, []);
  const observers = useRef(computed.__observers__);

  useEffect(() => {
    if (computed.__subscribers__ !== subscribers) {
      computed.__subscribers__ = subscribers;
      const observersArray = Array.from(observers.current);
      observersArray.forEach((observer) => observer.addDependency(computed));
      computed.__observers__ = new Set(observersArray);
      observers.current = computed.__observers__;
      computed.trigger();
    }
  }, [computed, subscribers, observers]);

  useEffect(
    () => () => {
      prevComputedInstance.current.destroy({ replaceSubscriptions: true });
      prevComputedInstance.current = computed;
    },
    [computed],
  );

  useEffect(
    () => () => {
      prevComputedInstance.current.destroy();
      computed.destroy();
    },
    [],
  );

  return computed;
};

export const useSignalEffect = (callback: () => void, deeps = []): SignalEffect => {
  const effect = useMemo(
    () =>
      new SignalEffect(
        callback,
        deeps.filter((object) => object instanceof Signal || object instanceof ComputedSignal),
      ),
    deeps,
  );
  const prevEffectInstance = useRef(effect);

  useEffect(
    () => () => {
      prevEffectInstance.current.destroy();
      prevEffectInstance.current = effect;
    },
    [effect],
  );

  useEffect(
    () => () => {
      prevEffectInstance.current.destroy();
      effect.destroy();
    },
    [],
  );

  return effect;
};

export const useDebouncedSignalEffect = (callback: () => void, deeps = [], debounceTime = 0) => {
  const preEffect = useRef(null);
  const effect = useMemo(
    () =>
      new DebouncedSignalEffect(
        callback,
        deeps.filter((object) => object instanceof Signal || object instanceof ComputedSignal),
        { debounceTime, isInitialized: Boolean(preEffect.current) },
      ),
    [...deeps, preEffect.current],
  );

  useEffect(() => {
    if (preEffect.current === effect) {
      return;
    }

    const prevEffect = preEffect.current;

    if (prevEffect) {
      const dep = prevEffect.__dependencies__;
      prevEffect.destroy();
      effect.registerDependencies(dep);
    }

    preEffect.current = effect;
  }, [effect, preEffect]);

  useEffect(
    () => () => {
      effect.destroy();
    },
    [],
  );
};

export const useComponentUpdateWithSignal = (...signals: Array<Signal | ComputedSignal>) => {
  const [_, setState] = useState(signals.map((signal) => signal.value));

  useEffect(() => {
    const unsubscribeArray = signals.map((signal, index) =>
      signal.subscribe((value) => {
        setState((prevState) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
      }),
    );

    return () => {
      unsubscribeArray.forEach((unsub) => unsub());
    };
  }, signals);
};
