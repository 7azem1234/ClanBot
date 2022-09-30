class Clan {

    constructor(ClanID, ClanName, LeaderID, Members, MessagesCounter, DateCreated) {
      this.ClanID = ClanID;
      this.ClanName = ClanName;
      this.LeaderID = LeaderID;
      this.Members = Members;
      this.MessagesCounter = MessagesCounter;
      this.DateCreated = DateCreated;
  }


}

module.exports.Clan = Clan