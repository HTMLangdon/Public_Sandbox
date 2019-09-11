/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Shared logging functionality.
 * @module cp/log
 */


/****************************************************************************
Notes & To-Do:
- This has NOT been converted to constructor module pattern.
- Add message type (info, warning, error, debug).
- Add filtering on subscribers (min type/level)?
****************************************************************************/

import { Utility as util } from './util';


export enum LogSeverity {
	Info,
	Warning,
	Error,
	Debug
}

export class LogMessage {
	/** Message contents. */
	public Message: string = "";
	/** Message source. */
	public Source?: any = null;
	/** Optional data associated with the message. */
	public Data?: any = null;
	/** Message timestamp. */
	public TS: Date;
	/** Message severity. */
	public Severity: LogSeverity;

	constructor(message?: string, source?: any, data?: any, ts?: Date, sev: LogSeverity = LogSeverity.Info) {
		let mod = this;

		if (message) mod.Message = message;
		if (source) mod.Source = source;
		if (data) mod.Data = data;
		if (ts) mod.TS = ts; else mod.TS = new Date();
		if (!util.IsNull(sev)) mod.Severity = sev;
	}
}

/**
 * Wrapper for the "writer" facade to write to the debugger console.
 * NOTE: Not all browsers contain a consistent console object.
 */
export class ConsoleWriter {
	Write(message: LogMessage) {
		let source = message.Source;
		let s = util.IsDefined(source) ? (util.IsDefined(source._ID) ? source._ID : util.ToSafeString(source)) : "Unknown";
		//console.log(message.TS.toString() + ": " + s + " - " + message.Message);
		console.log(message.TS.getTime().toString() + ": " + s + " - " + message.Message);
	}
}

/**
 * Log subscriber.
 */
export interface LogSubscriber {
	/**
	 * Write a log message to the subscriber.
	 * NOTE: This method should only be called from the logger itself.
	 */
	Write(message: LogMessage): void;
}

/**
 * Application logger.
 */
export class Log {
	/** Static log instance (private). */
	private static _instance: Log = new Log();
	/**
	 * Gets the current service manager instance.
	 */
	public static GetInstance(): Log { return this._instance; }

	/** Collection of subscribers. */
	private subs: LogSubscriber[] = [];
	/** Collection of messages. */
	private messages: LogMessage[] = [];
	/** Flag indicating if the log has been initialized or not. */
	private isInit: boolean = false;

	/** Initialize the log. */
	Initialize(): void {
		let mod = this;

		// If already initialized, end
		if (this.isInit) return;

		// [Placeholder for custom initialization code]

		// ### TEST: Add console logger
		//mod.AddConsole();

		mod.isInit = true;
	}

	/**
	 * Write a string message to the log.
	 * @param {string} message - Message content.
	 * @param {any} source - Optional message source.
	 * @param {any} data - Optional data associated with the message.
	 * @param {LogSeverity} sev - Optional message severity. Default "Info".
	 */
	Write(message: string, source?: any, data?: any, sev: LogSeverity = LogSeverity.Info): void {
		let mod = this;

		// Add to message list
		let m = new LogMessage(message, source, data, null, sev);
		mod.AddMessage(m);
	}

	/**
	 * Add a message to the log.
	 * This function expects a message object instead of simple message content.
	 * @param {LogMessage} message - Message content.
	 */
	AddMessage(message: LogMessage): void {
		// Make sure it is fully formed
		//if (util.IsNull(message.TS)) message.TS = util.GetTimestamp();
		if (util.IsNull(message.Source)) message.Source = "Unknown";
		if (util.IsNull(message.Message)) message.Message = "";
		if (!util.IsDefined(message.Data)) message.Data = null;

		// Add it to the list
		this.messages.push(message);

		// Push it to the subscribers
		for (let i = 0; i < this.subs.length; i++) {
			this.subs[i].Write(message);
		}
	}

	/**
	 * Adds a log Subscriber.
	 * @param {LogSubscriber} sub - Subscriber information.
	 */
	AddSubscriber(sub: LogSubscriber): void {
		let mod = this;

		mod.subs.push(sub);

		// Flush the message list for the new subscriber
		for (let i = 0; i < this.messages.length; i++) {
			let m = mod.messages[i];
			sub.Write(m);
		}
	}

	/**
	 * Adds the debugger console as a subscriber.
	 * NOTE: Not all browsers contain a consistent console object.
	 */
	AddConsole(): void {
		let mod = this;
		mod.AddSubscriber(new ConsoleWriter());
	}
}
