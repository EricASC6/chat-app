const Chat = require("../../models/Chat").model;

router.post("/newChat", async (req, res) => {
  const { id, newContactUsername, isGroup } = req.body;
  console.log(id, newContactUsername, isGroup);
  try {
    const srcUser = await User.findById(id);
    console.log(srcUser);
    const newContact = await User.findOne({ username: newContactUsername });
    console.log(newContact);

    const newChat = new Chat({
      isGroup: isGroup,
      users: [srcUser.username, newContact.username],
      messages: []
    });

    await newChat.save();

    const chatId = newChat._id;
    srcUser.chats.unshift(chatId);
    newContact.chats.unshift(chatId);
    await srcUser.save();
    await srcUser.save();
    res.json({ ok: true, chat: newChat, contact: newContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});
