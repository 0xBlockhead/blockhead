import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { type } from 'arktype'
import type { Page } from 'playwright'


// Start only after wallet secret entry has finished. No browser-wide tracing.
export const recordPage = async (page: Page, directory: string) => {
	await mkdir(directory, { recursive: false })
	const session = await page.context().newCDPSession(page)
	const frameWire = type({
		data: 'string',
		sessionId: 'number',
		metadata: { timestamp: 'number' },
	})
	const frames: { file: string, timestamp: number }[] = []
	let pending = Promise.resolve()
	let captureFailure: Error | undefined
	session.on('Page.screencastFrame', (payload) => {
		pending = pending.then(async () => {
			const frame = frameWire.assert(payload)
			const file = `${frames.length}.jpg`
			await writeFile(join(directory, file), Buffer.from(frame.data, 'base64'))
			frames.push({ file, timestamp: frame.metadata.timestamp })
			await session.send('Page.screencastFrameAck', { sessionId: frame.sessionId })
		}).catch((error: Error) => { captureFailure = error })
	})
	await session.send('Page.startScreencast', {
		format: 'jpeg',
		quality: 85,
		maxWidth: 1440,
		maxHeight: 1000,
		everyNthFrame: 1,
	})
	return async () => {
		const stoppedAt = Date.now() / 1000
		await session.send('Page.stopScreencast')
		await pending
		await session.detach()
		if (captureFailure)
			throw captureFailure

		if (!frames.length)
			throw new Error('No real browser frames were captured')

		const timeline = ['ffconcat version 1.0']
		for (const [index, frame] of frames.entries()) {
			timeline.push(`file '${frame.file}'`)
			const next = frames[index + 1]
			const duration = (next?.timestamp ?? stoppedAt) - frame.timestamp
			if (duration <= 0)
				throw new Error('Browser frame timestamps are not strictly increasing')

			timeline.push(`duration ${duration}`)
		}
		// Concat needs a following frame to honor the final static interval.
		timeline.push(`file '${frames[frames.length - 1].file}'`)
		await writeFile(join(directory, 'frames.ffconcat'), timeline.join('\n') + '\n')
		await writeFile(join(directory, 'frames.json'), JSON.stringify(frames, null, 2) + '\n')
		await promisify(execFile)('/opt/homebrew/bin/ffmpeg', [
			'-nostdin', '-n', '-f', 'concat', '-safe', '1', '-i', 'frames.ffconcat',
			'-vf', 'scale=1440:1000:force_original_aspect_ratio=decrease,pad=1440:1000:(ow-iw)/2:(oh-ih)/2',
			'-fps_mode', 'vfr', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
			'-movflags', '+faststart', 'clip.mp4',
		], { cwd: directory })
		return join(directory, 'clip.mp4')
	}
}
