declare module 'astro:env/client' {
	export const DRAFT_MODE_COOKIE_NAME: string;	
}declare module 'astro:env/server' {
	export const DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN: string;	
	export const DATOCMS_DRAFT_CONTENT_CDA_TOKEN: string;	
	export const DATOCMS_CMA_TOKEN: string;	
	export const SECRET_API_TOKEN: string;	
	export const SIGNED_COOKIE_JWT_SECRET: string;	
}