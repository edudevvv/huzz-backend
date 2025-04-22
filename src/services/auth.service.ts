import { Injectable } from "@nestjs/common";

import axios from "axios";
import { envConfig } from "src/env";

import { MessageBuilder, Webhook } from "discord-webhook-node";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AuthService { 
  constructor (private prisma: PrismaService) {}

  async handleCreateURL(jwt: string) {
    const uri = new URLSearchParams()
    uri.set("response_type", "code")
    uri.set("client_id", envConfig.clientId as string);
    uri.set("scope", "identify email guilds.join");
    uri.set("state", jwt);
    uri.set("redirect_uri", envConfig.callback as string);
    uri.set("prompt", "consent");
    uri.set("integration_type", "0");

    return `https://discord.com/oauth2/authorize?${uri.toString()}`;
  }

  async handleCreateUser(code: string, ip: string) {
    try { 
      const { data: userToken } = await axios({ 
        method: "POST", 
        url: "https://discord.com/api/oauth2/token", 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        data: {
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': envConfig.callback,
          'client_id': envConfig.clientId,
          'client_secret': envConfig.clientSecret
        } 
      });

      const { data: profile } = await axios({ 
        method: "GET",
        url: "https://discord.com/api/v10/users/@me",
        headers: { "Authorization": `Bearer ${userToken.access_token}`}
      });

      const findUser = await this.prisma.users.findUnique({ where: { id: profile.id } });
      if (!findUser) {
        await this.prisma.users.create({ 
          data: { id: profile.id, email: profile.email, username: profile.username, avatar: profile.avatar, accessToken: userToken.access_token, refreshToken: userToken.refresh_token }
        });
      } else { 
        await this.prisma.users.update({ 
          where: { id: profile.id },
          data: { username: profile.username, avatar: profile.avatar, accessToken: userToken.access_token, refreshToken: userToken.refresh_token, updatedAt: new Date() }
        })
      }
      
      const embed = new MessageBuilder()
        .setColor(0x2b2d31)
        .setAuthor("Novo membro vinculado", `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`)
        .addField('ID:', `\`${profile.id}\``, true)
        .addField('IP:', `\`${ip.replace("::ffff:", "")}\``, true)
        .addField('Username:', `\`${profile.username}\``, true)
        .addField('Email:', `\`${profile.email}\``, false)
        .addField('Total Membros:', `\`${(await this.prisma.users.count()).toLocaleString()}\``, true)

      const client = new Webhook({ url: envConfig.webhook as string });
        client.setAvatar("https://i.pinimg.com/736x/0e/90/73/0e9073e843751638758949f86a73fc87.jpg")
        client.setUsername("logs do sistema")
        client.send(embed)


      return profile.username;
    } catch { 
      return null;
    }
  }
}