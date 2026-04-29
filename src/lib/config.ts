interface AppConfig {
    name: string;
    logo: string | null;
    version: string;
    initials: string;
}

function parseInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

function getConfig(): AppConfig {
    const name = import.meta.env.VITE_APP_NAME ?? 'Моя система';
    return {
        name,
        logo: import.meta.env.VITE_APP_LOGO ?? null,
        version: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
        initials: parseInitials(name),
    };
}

export const config = getConfig();