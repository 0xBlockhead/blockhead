import { corsFetch } from '$/lib/http.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import type { X402PaymentRequired } from '$/sources/X402/Http/types.ts'

export const fetchPaymentNegotiation = async ({
	url,
	origins,
}: {
	url: string
	origins: readonly SourceOrigin[]
}) => {
	const response = await corsFetch(url, {
		origins,
	})

	return response.json<X402PaymentRequired>()
}
