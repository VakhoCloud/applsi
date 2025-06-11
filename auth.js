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
    const hashedInput = await hashPassword(password);
    return hashedInput === hashedPassword;
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
} 