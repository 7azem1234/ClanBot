class Clan {

    constructor(ClanID, ClanName, LeaderID, Members, MsgsCounter, DateCreated) {
      this.ClanID = ClanID;
      this.ClanName = ClanName;
      this.LeaderID = LeaderID;
      this.Members = Members;
      this.MsgsCounter = MsgsCounter;
      this.DateCreated = DateCreated;
  }


}

module.exports.Clan = Clan