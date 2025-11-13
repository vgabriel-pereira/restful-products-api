const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')

async function register(req, res) {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, msg: 'Campos obrigatórios faltando' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({ name: name, email: email, password: hashPassword })
        const { password: _, ...userWithoutPassword } = newUser.toObject()
        return res.status(201).json({ success: true, msg: 'Usuário criado', data: userWithoutPassword })
    } catch (err) {
        console.error('Cadastro error:', err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(409).json({ success: false, msg: "Email já cadastrado" });
        }
        return res.status(500).json({ success: false, msg: "Erro ao criar usuário" })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Campos obrigatórios faltando'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'Usuário ou senha inválido'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Usuário ou senha inválido'
            });
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            iat: Math.floor(Date.now() / 1000)
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            success: true,
            msg: 'Login realizado com sucesso',
            token,
            payload,
            data: userWithoutPassword
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            msg: 'Erro ao realizar login'
        });
    }
}

async function getProfile(req, res) {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: id }).select('-password')
        return res.status(200).json({ success: true, data: user })
    } catch (err) {
        console.error('Get profile error:', err)
        return res.status(500).json({ success: false, msg: 'Erro ao obter perfil' })
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params
        const updates = req.body
        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, { $set: updates }, { new: true, runValidators: true }
        )
        return res.status(200).json({ success: true, msg: 'Usuário atualizado', data: updatedUser })
    } catch (err) {
        console.error('Update user error:', err)
        return res.status(500).json({ success: false, msg: 'Erro ao atualizar usuário' })
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params
        const deletedUser = await User.findOneAndDelete({ _id: id })
        return res.status(204).json({ success: true, msg: 'Usuário deletado' })
    } catch (err) {
        console.error('Delete user error:', err)
        return res.status(500).json({ success: false, msg: 'Erro ao deletar usuário' })
    }
}

module.exports = { register, login, getProfile, updateUser, deleteUser }