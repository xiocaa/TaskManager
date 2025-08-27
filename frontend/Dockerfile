# ---- Build stage ----
FROM node:20.19.0 AS build
WORKDIR /app

# 只拷贝 package.json（不要拷贝 package-lock.json）
COPY package.json ./

# 在 Linux 容器内按本平台重新解析依赖
RUN npm install --no-audit --no-fund

# 再拷贝源码，其它文件
COPY . .

# 生产构建
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

