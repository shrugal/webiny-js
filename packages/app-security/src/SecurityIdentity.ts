import minimatch from "minimatch";

export type SecurityPermission = { name: string; [key: string]: any };

export type SecurityIdentityData = {
    login: string;
    permissions?: SecurityPermission[];
    logout(): void;
    [key: string]: any;
    getPermission?(permission: string): SecurityPermission;
};

export class SecurityIdentity {
    login: string;
    permissions: SecurityPermission[];
    [key: string]: any;

    constructor(data: SecurityIdentityData) {
        Object.assign(this, data);
    }

    /**
     * Create a new instance of SecurityIdentity from the existing instance.
     */
    static from(identity: SecurityIdentity, data: Partial<SecurityIdentityData>) {
        const currentData = Object.keys(identity).reduce((acc, key) => {
            acc[key] = identity[key];
            return acc;
        }, {}) as SecurityIdentityData;

        return new SecurityIdentity({ ...currentData, ...data });
    }

    setPermissions(permissions: SecurityPermission[]) {
        this.permissions = permissions;
    }

    getPermission(permission): SecurityPermission {
        const perms = this.permissions || [];
        const exactMatch = perms.find(p => p.name === permission);
        if (exactMatch) {
            return exactMatch;
        }

        // Try matching using patterns
        if (perms.find(p => minimatch(permission, p.name))) {
            return { name: permission };
        }

        return null;
    }

    logout() {
        console.warn(`You must implement a "logout" method when setting SecurityIdentity!`);
    }
}
