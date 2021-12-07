const { MessageActionRow, MessageButton } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('yes')
      .setLabel('Confirm')
      .setStyle('DANGER'),
    new MessageButton()
      .setCustomId('no')
      .setLabel('Cancel')
      .setStyle('SUCCESS')
  )

function del(interaction) {

  str = `Are you sure you want to delete ${interaction.options.getInteger('integer')}?`

  db.get('encourage').then(value => {
    if(interaction.options.getInteger('integer')>=value.length) {
      return interaction.reply('The provided integer does not exist!\n *Please check *`/encourage list`* for correct index*')
    }

    interaction.reply({ components: [row], content: str }).then(() => {

    const filter = i => {
      i.deferUpdate();
      if (interaction.user.id === i.user.id) {
        return true
      } else {
        i.followUp({ content: 'This button is not for you!', ephemeral: true })
        return false
      }
    }

    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000, max: 1 })

    collector.on('collect', async (collected) => {
      const id = collected.customId;
      
      if(id === 'yes') {
        db.get('encourage').then(value => {
          console.log('here')
          value.splice(interaction.options.getInteger('integer'), 1)
          db.set('encourage', value).then(() => collected.followUp('Message deleted!'))
        })
      }else if(id === 'no'){
        collected.followUp('Deletion canceled!')
      }
    })
    // interaction.channel.awaitMessageComponent({ filter, time: 60000, componenetType: 'BUTTON', max: 1 })
    //   .then(async (collected) => {
    //     if(collected.customId === 'yes' || collected.customId === 'no'){
    //       if (collected.customId === 'yes') {
    //         db.get('encourage').then(value => {
    //           value.splice(interaction.options.getInteger('integer'), 1)
    //           db.set('encourage', value).then(() => collected.followUp('Message deleted!'))
    //         })
    //       } else if(collected.customId === 'no'){
    //         collected.followUp('Deletion canceled!')
    //       }
    //     }
    //   })
    //   .catch(() => {
    //     interaction.followUp('Command canceled! You took too long!')
    //   })
    })
  })
}

module.exports = del