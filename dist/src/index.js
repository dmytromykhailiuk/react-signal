"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReactive = exports.useComponentUpdateWithSignal = exports.useDebouncedSignalEffect = exports.useSignalEffect = exports.useComputedSignal = exports.useSignal = void 0;
const reactive_1 = require("@dmytromykhailiuk/reactive");
const react_1 = require("react");
const useSignal = (value, deeps = []) => {
    const signal = (0, react_1.useMemo)(() => new reactive_1.Signal(value), deeps);
    const prevSignalInstance = (0, react_1.useRef)(signal);
    const subscribers = (0, react_1.useMemo)(() => signal.__subscribers__, []);
    const observers = (0, react_1.useRef)(signal.__observers__);
    (0, react_1.useEffect)(() => {
        if (signal.__subscribers__ !== subscribers) {
            signal.__subscribers__ = subscribers;
            const observersArray = Array.from(observers.current);
            observersArray.forEach((observer) => observer.addDependency(signal));
            signal.__observers__ = new Set(observersArray);
            observers.current = signal.__observers__;
            signal.trigger();
        }
    }, [signal, subscribers, observers]);
    (0, react_1.useEffect)(() => () => {
        prevSignalInstance.current.destroy({ replaceSubscriptions: true });
        prevSignalInstance.current = signal;
    }, [signal]);
    (0, react_1.useEffect)(() => () => {
        prevSignalInstance.current.destroy();
        signal.destroy();
    }, []);
    return signal;
};
exports.useSignal = useSignal;
const useComputedSignal = (callback, deeps = []) => {
    const computed = (0, react_1.useMemo)(() => new reactive_1.ComputedSignal(callback, deeps.filter((object) => object instanceof reactive_1.Signal || object instanceof reactive_1.ComputedSignal)), deeps);
    const prevComputedInstance = (0, react_1.useRef)(computed);
    const subscribers = (0, react_1.useMemo)(() => computed.__subscribers__, []);
    const observers = (0, react_1.useRef)(computed.__observers__);
    (0, react_1.useEffect)(() => {
        if (computed.__subscribers__ !== subscribers) {
            computed.__subscribers__ = subscribers;
            const observersArray = Array.from(observers.current);
            observersArray.forEach((observer) => observer.addDependency(computed));
            computed.__observers__ = new Set(observersArray);
            observers.current = computed.__observers__;
            computed.trigger();
        }
    }, [computed, subscribers, observers]);
    (0, react_1.useEffect)(() => () => {
        prevComputedInstance.current.destroy({ replaceSubscriptions: true });
        prevComputedInstance.current = computed;
    }, [computed]);
    (0, react_1.useEffect)(() => () => {
        prevComputedInstance.current.destroy();
        computed.destroy();
    }, []);
    return computed;
};
exports.useComputedSignal = useComputedSignal;
const useSignalEffect = (callback, deeps = []) => {
    const effect = (0, react_1.useMemo)(() => new reactive_1.SignalEffect(callback, deeps.filter((object) => object instanceof reactive_1.Signal || object instanceof reactive_1.ComputedSignal)), deeps);
    const prevEffectInstance = (0, react_1.useRef)(effect);
    (0, react_1.useEffect)(() => () => {
        prevEffectInstance.current.destroy();
        prevEffectInstance.current = effect;
    }, [effect]);
    (0, react_1.useEffect)(() => () => {
        prevEffectInstance.current.destroy();
        effect.destroy();
    }, []);
    return effect;
};
exports.useSignalEffect = useSignalEffect;
const useDebouncedSignalEffect = (callback, deeps = [], debounceTime = 0) => {
    const preEffect = (0, react_1.useRef)(null);
    const effect = (0, react_1.useMemo)(() => new reactive_1.DebouncedSignalEffect(callback, deeps.filter((object) => object instanceof reactive_1.Signal || object instanceof reactive_1.ComputedSignal), { debounceTime, isInitialized: Boolean(preEffect.current) }), [...deeps, preEffect.current]);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => () => {
        effect.destroy();
    }, []);
};
exports.useDebouncedSignalEffect = useDebouncedSignalEffect;
const useComponentUpdateWithSignal = (...signals) => {
    const [_, setState] = (0, react_1.useState)(signals.map((signal) => signal.value));
    (0, react_1.useEffect)(() => {
        const unsubscribeArray = signals.map((signal, index) => signal.subscribe((value) => {
            setState((prevState) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
        }));
        return () => {
            unsubscribeArray.forEach((unsub) => unsub());
        };
    }, signals);
};
exports.useComponentUpdateWithSignal = useComponentUpdateWithSignal;
const useReactive = (signal) => {
    const [_, updateState] = (0, react_1.useState)(signal.value);
    (0, react_1.useEffect)(() => {
        return signal.subscribe((value) => updateState(value));
    }, [signal]);
    return signal;
};
exports.useReactive = useReactive;
//# sourceMappingURL=index.js.map