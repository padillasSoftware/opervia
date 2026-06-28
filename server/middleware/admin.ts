
export default defineEventHandler( async (event) => {
    
    if (!event.path.startsWith('/api/admin')) return;


    const rolesAllowed = ['SUPER_ADMIN', 'MANAGER'];
     const session = await requireUserSession(event)

    const hasAdminRole = rolesAllowed.includes(session.user.role)

    if (!hasAdminRole) {
        throw createError({ status: 401, message: 'Unauthorized'})
    }

    return;

})