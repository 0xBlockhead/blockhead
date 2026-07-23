import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'

export const getDexscreenerJson = <_Response>(
	binding: SourceBinding,
	pathAndQuery: string
): Promise<_Response> => {
	if (
		binding.provider !== SourceProvider.Dexscreener
		|| binding.source !== Source.Dexscreener_OpenApi
		|| binding.target.kind !== SourceTargetKind.Global
		|| binding.target.key !== 'dexscreener-openapi'
		|| binding.wireProtocol !== WireProtocol.HttpRest
		|| binding.apiFamily !== ApiFamily.OpenApiHttp
		|| binding.delivery !== SourceDelivery.HttpProxy
		|| !binding.credentials.every((credential) => (
			credential.scope === SourceCredentialScope.None
		))
		|| firstHttpUrlForBinding(binding) !== 'https://api.dexscreener.com'
	)
		throw new Error('Dexscreener_OpenApi: expected canonical proxied source binding')

	return getJson<_Response>(binding, pathAndQuery)
}
