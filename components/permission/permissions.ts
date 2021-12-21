export const ROLES = {
    guest: "guest",
    reader: "reader",
    author: "author",
    moder: "moder",
    admin: "admin",
}

export const SCOPES = {
    // Novels
    viewNovel: "viewNovel",
    createNovel: "createNovel",
    editNovel: "editNovel",
    deleteNovel: "deleteNovel",

    // Admin
    viewAdminPanel: "viewAdminPanel",
    editUser: "editUser",
    deleteUser: "deleteUser",
}

export const ROUTES = {
    home: "/",
    my: "/my",
}

export const PERMISSIONS = {
    [ROLES.guest]: [SCOPES.viewNovel],
    [ROLES.reader]: [SCOPES.viewNovel, SCOPES.createNovel],
    [ROLES.author]: [SCOPES.viewNovel, SCOPES.createNovel, SCOPES.editNovel, SCOPES.deleteNovel],
    [ROLES.moder]: [SCOPES.viewAdminPanel, SCOPES.viewNovel, SCOPES.createNovel, SCOPES.editNovel, SCOPES.deleteNovel],
    [ROLES.admin]: [SCOPES.viewAdminPanel, SCOPES.editUser, SCOPES.deleteUser, SCOPES.viewNovel, SCOPES.createNovel, SCOPES.editNovel, SCOPES.deleteNovel],
}

export const ROUTES_PERMISSIONS = {
    [ROLES.guest]: [ROUTES.home],
    [ROLES.reader]: [ROUTES.home, ROUTES.my],
    [ROLES.author]: [ROUTES.home, ROUTES.my],
    [ROLES.moder]: [ROUTES.home, ROUTES.my],
    [ROLES.admin]: [ROUTES.home, ROUTES.my],
}
