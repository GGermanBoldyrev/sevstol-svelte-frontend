export type AlertType = 'success' | 'danger';

let alertState = $state({
    show: false,
    type: 'success' as AlertType,
    text: ''
});

export const alert = {
    get current() { return alertState },
    show(text: string, type: AlertType = 'success') {
        alertState.text = text;
        alertState.type = type;
        alertState.show = true;
        setTimeout(() => { alertState.show = false }, 3000);
    }
};