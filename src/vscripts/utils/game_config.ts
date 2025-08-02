export function GameConfig() {
    // 是否开启第一滴血
    GameRules.SetFirstBloodActive(false)
    // 设置根据时间的金钱奖励
    GameRules.SetGoldPerTick(0)
    // 设置金钱奖励时间
    GameRules.SetGoldTickTime(-1)
    // 设置起始金钱
    GameRules.SetStartingGold(0)
    // 设置一天的时间
    GameRules.SetTimeOfDay(0.251)
    // 是否开启英雄重生
    GameRules.SetHeroRespawnEnabled(true)
    // 是否允许选择相同英雄
    GameRules.SetSameHeroSelectionEnabled(true)
    // 设置选择英雄时间
    GameRules.SetHeroSelectionTime(0)
    // 设置选择英雄惩罚时间
    GameRules.SetHeroSelectPenaltyTime(0)
    // 锁定读秒时间
    GameRules.SetCustomGameSetupAutoLaunchDelay(10)
    // 设置决策时间
    GameRules.SetStrategyTime(0)
    // 设置展示时间
    GameRules.SetShowcaseTime(0)
    // 设置游戏开始前准备的时间
    GameRules.SetPreGameTime(0)
    // 是否隐藏击杀提示
    GameRules.SetHideKillMessageHeaders(true)
    // 设置游戏结束后停留的时间
    GameRules.SetPostGameTime(180)
    // 设置树木再生时间
    GameRules.SetTreeRegrowTime(-1)
    // 是否使用默认的击杀奖励
    GameRules.SetUseBaseGoldBountyOnHeroes(false)
    // 是否没有在神秘商店也可以买到神秘商店的物品
    GameRules.SetUseUniversalShopMode(false)
    // 胜利消息持续时间
    GameRules.SetCustomVictoryMessageDuration(5)
    // 允许使用战斗音乐
    GameRules.SetCustomGameAllowBattleMusic(false)
    // 允许使用选择英雄音乐
    GameRules.SetCustomGameAllowHeroPickMusic(false)
    // 允许使用游戏开始的音乐
    GameRules.SetCustomGameAllowMusicAtGameStart(false)
    // 设置近战格挡几率
    GameRules.GetGameModeEntity().SetInnateMeleeDamageBlockPercent(0)


    // 设置队伍人数
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5) // 天辉
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5)  // 夜魇
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.NEUTRALS, 0) // 野怪
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.NOTEAM, 0) // 无队伍
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_1, 0) // 自定义队伍1
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_2, 0) // 自定义队伍2
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_3, 0) // 自定义队伍3
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_4, 0) // 自定义队伍4
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_5, 0) // 自定义队伍5
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_6, 0) // 自定义队伍6
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_7, 0) // 自定义队伍7
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_8, 0) // 自定义队伍8
    GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.DRAFT_POOL, 0)    // 

    const game_mode = GameRules.GetGameModeEntity()

    // BOT设定
    game_mode.SetBotThinkingEnabled(false)
    // 英雄选择界面超时未选择英雄的金币减少惩罚
    game_mode.SetSelectionGoldPenaltyEnabled(false)
    // 返回是否关闭/开启储藏处购买功能。如果该功能被关闭，英雄必须在商店范围内购买物品
    game_mode.SetStashPurchasingDisabled(true)
    // 是否禁用天气特效
    game_mode.SetWeatherEffectsDisabled(true)
    // 总是显示玩家名字
    game_mode.SetAlwaysShowPlayerNames(false)
    // 总是显示玩家的仓库，无论选择任何单位
    game_mode.SetAlwaysShowPlayerInventory(false)
    // 是否禁用播音员
    game_mode.SetAnnouncerDisabled(true)
    // 是否开启买活
    game_mode.SetBuybackEnabled(false)
    // 是否开启买活CD
    game_mode.SetCustomBuybackCooldownEnabled(false)
    // 是否开启买活需要消耗金币
    game_mode.SetCustomBuybackCostEnabled(true)
    // 设置默认镜头高度
    game_mode.SetCameraDistanceOverride(1135)
    // 强制玩家选择英雄
    // game_mode.SetCustomGameForceHero('npc_dota_hero_wisp')
    // 设置固定的复活时间
    game_mode.SetFixedRespawnTime(5)
    // 是否禁用战争迷雾
    game_mode.SetFogOfWarDisabled(false)
    // 是否开启黑色迷雾，开启后地图一开始是全黑的，需要探索后才会显示
    game_mode.SetUnseenFogOfWarEnabled(true)
    // 设置泉水回复魔法值的速率
    // game_mode.SetFountainConstantManaRegen(1)
    // 设置泉水回复生命值的速率
    // game_mode.SetFountainPercentageHealthRegen(1)
    // 设置泉水回复魔法值百分比
    // game_mode.SetFountainPercentageManaRegen(1)
    // 是否禁用金币掉落的音效
    game_mode.SetGoldSoundDisabled(false)
    // 是否英雄死亡损失金币
    game_mode.SetLoseGoldOnDeath(false)
    // 设置最大攻击速度
    game_mode.SetMaximumAttackSpeed(1000)
    // 设置最小攻击速度
    game_mode.SetMinimumAttackSpeed(10)
    // 是否禁用物品推荐
    game_mode.SetRecommendedItemsDisabled(true)
    // 当幻象死亡后是否删除
    game_mode.SetRemoveIllusionsOnDeath(true)
    // 是否开启双倍神符
    game_mode.SetRuneEnabled(RuneType.DOUBLEDAMAGE, false)
    // 是否开启加速神符
    game_mode.SetRuneEnabled(RuneType.HASTE, false)
    // 是否开启幻象神符
    game_mode.SetRuneEnabled(RuneType.ILLUSION, false)
    // 是否开启隐身神符
    game_mode.SetRuneEnabled(RuneType.INVISIBILITY, false)
    // 是否开启恢复神符
    game_mode.SetRuneEnabled(RuneType.REGENERATION, false)
    // 是否开启赏金神符
    game_mode.SetRuneEnabled(RuneType.BOUNTY, false)
    // 隐藏置顶物品在快速购买
    game_mode.SetStickyItemDisabled(true)
    // 禁止显示死亡消息
    game_mode.SetDeathTipsDisabled(false)
    // 指定是否在HUD中显示默认作战事件
    game_mode.SetHudCombatEventsDisabled(true)
    // 是否关闭中立物品
    game_mode.SetNeutralStashTeamViewOnlyEnabled(true)
    // 死了给tp
    game_mode.SetGiveFreeTPOnDeath(false)
}