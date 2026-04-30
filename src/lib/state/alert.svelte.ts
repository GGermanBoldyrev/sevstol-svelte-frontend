export type AlertType = 'success' | 'danger';

let alertState = $state({
    show: false,
    type: 'success' as AlertType,
    text: ''
});

let timer: ReturnType<typeof setTimeout> | null = null;

export const alert = {
    get current() {
        return alertState;
    },
    show(text: string, type: AlertType = 'success') {
        if (timer) clearTimeout(timer);
        alertState.text = text;
        alertState.type = type;
        alertState.show = true;
        const delay = type === 'success' ? 2000 : 5000;
        timer = setTimeout(() => {
            alertState.show = false;
            timer = null;
        }, delay);
    },
    hide() {
        if (timer) clearTimeout(timer);
        alertState.show = false;
    }
};