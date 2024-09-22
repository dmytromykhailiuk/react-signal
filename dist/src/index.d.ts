import { ComputedSignal, Signal, SignalEffect } from '@dmytromykhailiuk/reactive';
export declare const useSignal: <T = any>(value: T, deeps?: any[]) => Signal<T>;
export declare const useComputedSignal: <T = any>(callback: () => T, deeps?: any[]) => ComputedSignal<T>;
export declare const useSignalEffect: (callback: () => void, deeps?: any[]) => SignalEffect;
export declare const useDebouncedSignalEffect: (callback: () => void, deeps?: any[], debounceTime?: number) => void;
export declare const useComponentUpdateWithSignal: (...signals: Array<Signal | ComputedSignal>) => void;
