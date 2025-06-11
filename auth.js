


// Authentication helper functions
export async function createUser(env, username, email, password) {
    try {
        // Hash the password before storing
        const hashedPassword = await hashPassword(password);
        
        const result = await env.DB.prepare(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
        ).bind(username, email, hashedPassword).run();
        
        return { success: true, userId: result.meta.last_row_id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserByEmail(env, email) {
    try {
        const user = await env.DB.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).bind(email).first();
        
        return user;
    } catch (error) {
        return null;
    }
}

export async function verifyPassword(password, hashedPassword) {
    // In a real application, you would use a proper password hashing library
    // This is just a placeholder - DO NOT use in production
    return password === hashedPassword;
}

async function hashPassword(password) {
    // In a real application, you would use a proper password hashing library
    // This is just a placeholder - DO NOT use in production
    return password;
} 