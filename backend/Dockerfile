# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código para o diretório de trabalho
COPY . .

# Compile o TypeScript para gerar os arquivos .js
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Defina o comando padrão para rodar o servidor em produção
CMD ["npm", "start"]
