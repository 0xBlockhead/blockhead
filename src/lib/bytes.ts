export const formatByteCount = (byteCount: number | bigint) => {
	if (Number(byteCount) === 0) return '0 B'

	const sizes = [
		'B',
		'KB',
		'MB',
		'GB',
		'TB',
		'PB',
		'EB',
		'ZB',
		'YB',
	]
	const sizeIndex = Math.floor(
		Math.log(Number(byteCount)) / Math.log(1024),
	)

	return `${parseFloat((Number(byteCount) / 1024 ** sizeIndex).toFixed(2))} ${sizes[sizeIndex]}`
}
