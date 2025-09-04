import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/user'); // Assuming a /api/user endpoint
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Failed to load user', error);
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            const { user, token } = response.data;
            localStorage.setItem('authToken', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            return true;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
