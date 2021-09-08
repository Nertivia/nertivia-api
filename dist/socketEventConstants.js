"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOM_EMOJI_REMOVE = exports.CUSTOM_EMOJI_UPLOADED = exports.CUSTOM_EMOJI_RENAME = exports.RELATIONSHIP_ACCEPT = exports.RELATIONSHIP_REMOVE = exports.RELATIONSHIP_ADD = exports.CUSTOM_STATUS_CHANGE = exports.USER_STATUS_CHANGE = exports.GOOGLE_DRIVE_LINKED = exports.VOICE_RECEIVE_RETURN_SIGNAL = exports.VOICE_RECEIVE_SIGNAL = exports.USER_LEFT_CALL = exports.USER_JOINED_CALL = exports.SELF_CUSTOM_STATUS_CHANGE = exports.USER_UNBLOCKED = exports.USER_BLOCKED = exports.SELF_STATUS_CHANGE = exports.SERVER_MUTE = exports.SERVER_MEMBER_REMOVE_ROLE = exports.SERVER_REMOVE_ROLE = exports.SERVER_UPDATE_ROLE = exports.SERVER_CREATE_ROLE = exports.SERVER_UPDATE_ROLES = exports.SERVER_ROLES = exports.SERVER_MEMBER_ADD = exports.SERVER_MEMBERS = exports.SERVER_MEMBER_REMOVE = exports.SERVER_LEAVE = exports.SERVER_JOINED = exports.SERVER_ADD_ROLE = exports.SERVER_POSITION = exports.SERVER_CHANNEL_POSITION_CHANGE = exports.SERVER_CHANNEL_UPDATE = exports.SERVER_CHANNEL_REMOVED = exports.SERVER_CHANNEL_CREATED = exports.CHANNEL_MUTE = exports.CHANNEL_UNMUTE = exports.CHANNEL_REMOVED = exports.CHANNEL_CREATED = exports.NOTIFICATION_DISMISS = exports.UPDATE_MESSAGE_REACTION = exports.ADD_MESSAGE_REACTION = exports.UPDATE_MESSAGE = exports.DELETE_MESSAGE = exports.RECEIVE_MESSAGE = exports.AUTH_ERROR = exports.SUCCESS = exports.RECONNECTING = exports.DISCONNECT = exports.CONNECT = void 0;
exports.PROGRAM_ACTIVITY_CHANGED = void 0;
// connection events
exports.CONNECT = "connect";
exports.DISCONNECT = "disconnect";
exports.RECONNECTING = "reconnecting";
exports.SUCCESS = "success";
exports.AUTH_ERROR = "auth_err";
// message events
exports.RECEIVE_MESSAGE = "receive_message";
exports.DELETE_MESSAGE = "delete_message";
exports.UPDATE_MESSAGE = "update_message";
// message reaction events
exports.ADD_MESSAGE_REACTION = "message:add_reaction";
exports.UPDATE_MESSAGE_REACTION = "message:update_reaction";
// notification events
exports.NOTIFICATION_DISMISS = "notification:dismiss";
// channel events
exports.CHANNEL_CREATED = "channel:created";
exports.CHANNEL_REMOVED = "channel:remove";
exports.CHANNEL_UNMUTE = "channel:unmute";
exports.CHANNEL_MUTE = "channel:mute";
// server channel events
exports.SERVER_CHANNEL_CREATED = "server:add_channel";
exports.SERVER_CHANNEL_REMOVED = "server:remove_channel";
exports.SERVER_CHANNEL_UPDATE = "server:update_channel";
exports.SERVER_CHANNEL_POSITION_CHANGE = "server:channel_position";
// server events
exports.SERVER_POSITION = "self:server_position";
exports.SERVER_ADD_ROLE = "serverMember:add_role";
exports.SERVER_JOINED = "server:joined";
exports.SERVER_LEAVE = "server:leave";
exports.SERVER_MEMBER_REMOVE = "server:member_remove";
exports.SERVER_MEMBERS = "server:members";
exports.SERVER_MEMBER_ADD = "server:member_add";
exports.SERVER_ROLES = "server:roles";
exports.SERVER_UPDATE_ROLES = "server:update_roles";
exports.SERVER_CREATE_ROLE = "server:create_role";
exports.SERVER_UPDATE_ROLE = "server:update_role";
exports.SERVER_REMOVE_ROLE = "server:delete_role";
exports.SERVER_MEMBER_REMOVE_ROLE = "serverMember:remove_role";
exports.SERVER_MUTE = "server:mute";
// user events
exports.SELF_STATUS_CHANGE = "multi_device_status";
exports.USER_BLOCKED = "user:block";
exports.USER_UNBLOCKED = "user:unblock";
exports.SELF_CUSTOM_STATUS_CHANGE = "multi_device_custom_status";
// call events
exports.USER_JOINED_CALL = "user:joined_call";
exports.USER_LEFT_CALL = "user:left_call";
exports.VOICE_RECEIVE_SIGNAL = "voice:receive_signal";
exports.VOICE_RECEIVE_RETURN_SIGNAL = "voice:receive_return_signal";
exports.GOOGLE_DRIVE_LINKED = "googleDrive:linked";
exports.USER_STATUS_CHANGE = "user_status_change";
exports.CUSTOM_STATUS_CHANGE = "member:custom_status_change";
// relationship events
exports.RELATIONSHIP_ADD = "relationship_add";
exports.RELATIONSHIP_REMOVE = "relationship_remove";
exports.RELATIONSHIP_ACCEPT = "relationship_accept";
// custom emoji events
exports.CUSTOM_EMOJI_RENAME = "customEmoji:rename";
exports.CUSTOM_EMOJI_UPLOADED = "customEmoji:uploaded";
exports.CUSTOM_EMOJI_REMOVE = "customEmoji:remove";
// program activity events
exports.PROGRAM_ACTIVITY_CHANGED = "programActivity:changed";
