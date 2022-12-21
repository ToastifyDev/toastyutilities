import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/Command";
import { FailEmbed, SuccessEmbed } from "../../structures/Embed";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async ({ interaction }) => {
    const member = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    if (!member)
      return interaction.reply({
        embeds: [new FailEmbed("I couldn't find that user.")],
        ephemeral: true,
      });
    if (member.permissions.has(["BanMembers", "Administrator"]))
      return interaction.reply({
        embeds: [new FailEmbed("That user is a mod/admin, I can't do that.")],
        ephemeral: true,
      });
    if (!member.bannable)
      return interaction.reply({
        embeds: [new FailEmbed("I don't have permission to ban that user.")],
        ephemeral: true,
      });
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new FailEmbed("That user has roles that are higher/equal to yours."),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.ban({ reason });

    interaction.reply({
      embeds: [new SuccessEmbed(`**${member.user.tag}** was banned.`)],
    });
  },
});
