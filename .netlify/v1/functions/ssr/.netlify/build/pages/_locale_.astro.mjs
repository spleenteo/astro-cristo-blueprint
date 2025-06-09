import { e as createComponent, f as createAstro, k as renderComponent, l as Fragment, r as renderTemplate, u as unescapeHTML, A as AstroError, n as EnvInvalidVariables, m as maybeRenderHead, h as addAttribute, o as renderHead, p as renderSlot } from '../chunks/astro/server_DVJ825Ka.mjs';
import 'kleur/colors';
/* empty css                                 */
import { executeQuery as executeQuery$1 } from '@datocms/cda-client';
import { initGraphQLTada } from 'gql.tada';
import jwt from 'jsonwebtoken';
export { renderers } from '../renderers.mjs';

function renderMetaTagsToString(data) {
  return data.map((tag) => {
    if (tag.tag === "title") {
      return `<title>${tag.content}</title>`;
    }
    const serializedAttrs = [];
    for (const key in tag.attributes) {
      if (Object.prototype.hasOwnProperty.call(tag.attributes, key)) {
        serializedAttrs.push(`${key}="${tag.attributes[key]}"`);
      }
    }
    return `<${tag.tag} ${serializedAttrs.join(" ")} />`;
  }).join("\n");
}

const $$Astro$4 = createAstro();
const $$Seo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Seo;
  const { data } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(renderMetaTagsToString(data))}` })}`;
}, "/Users/spleenteo/Sites/spl-cristo/node_modules/@datocms/astro/src/Seo/Seo.astro", void 0);

const schema = {"DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN":{"context":"server","access":"secret","type":"string"},"DATOCMS_DRAFT_CONTENT_CDA_TOKEN":{"context":"server","access":"secret","type":"string"},"DATOCMS_CMA_TOKEN":{"context":"server","access":"secret","type":"string"},"SECRET_API_TOKEN":{"context":"server","access":"secret","type":"string"},"SIGNED_COOKIE_JWT_SECRET":{"context":"server","access":"secret","type":"string"},"DRAFT_MODE_COOKIE_NAME":{"context":"client","access":"public","type":"string"}};

function invalidVariablesToError(invalid) {
  const _errors = [];
  for (const { key, type, errors } of invalid) {
    if (errors[0] === "missing") {
      _errors.push(`${key} is missing`);
    } else if (errors[0] === "type") {
      _errors.push(`${key}'s type is invalid, expected: ${type}`);
    } else {
      _errors.push(`The following constraints for ${key} are not met: ${errors.join(", ")}`);
    }
  }
  return _errors;
}

function getEnvFieldType(options) {
  const optional = options.optional ? options.default !== void 0 ? false : true : false;
  let type;
  if (options.type === "enum") {
    type = options.values.map((v) => `'${v}'`).join(" | ");
  } else {
    type = options.type;
  }
  return `${type}${optional ? " | undefined" : ""}`;
}
const stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
  if (typeof input !== "string") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (max !== void 0 && !(input.length <= max)) {
    errors.push("max");
  }
  if (min !== void 0 && !(input.length >= min)) {
    errors.push("min");
  }
  if (length !== void 0 && !(input.length === length)) {
    errors.push("length");
  }
  if (url !== void 0 && !URL.canParse(input)) {
    errors.push("url");
  }
  if (includes !== void 0 && !input.includes(includes)) {
    errors.push("includes");
  }
  if (startsWith !== void 0 && !input.startsWith(startsWith)) {
    errors.push("startsWith");
  }
  if (endsWith !== void 0 && !input.endsWith(endsWith)) {
    errors.push("endsWith");
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: input
  };
};
const numberValidator = ({ gt, min, lt, max, int }) => (input) => {
  const num = parseFloat(input ?? "");
  if (isNaN(num)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  const errors = [];
  if (gt !== void 0 && !(num > gt)) {
    errors.push("gt");
  }
  if (min !== void 0 && !(num >= min)) {
    errors.push("min");
  }
  if (lt !== void 0 && !(num < lt)) {
    errors.push("lt");
  }
  if (max !== void 0 && !(num <= max)) {
    errors.push("max");
  }
  if (int !== void 0) {
    const isInt = Number.isInteger(num);
    if (!(int ? isInt : !isInt)) {
      errors.push("int");
    }
  }
  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }
  return {
    ok: true,
    value: num
  };
};
const booleanValidator = (input) => {
  const bool = input === "true" ? true : input === "false" ? false : void 0;
  if (typeof bool !== "boolean") {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: bool
  };
};
const enumValidator = ({ values }) => (input) => {
  if (!(typeof input === "string" ? values.includes(input) : false)) {
    return {
      ok: false,
      errors: ["type"]
    };
  }
  return {
    ok: true,
    value: input
  };
};
function selectValidator(options) {
  switch (options.type) {
    case "string":
      return stringValidator(options);
    case "number":
      return numberValidator(options);
    case "boolean":
      return booleanValidator;
    case "enum":
      return enumValidator(options);
  }
}
function validateEnvVariable(value, options) {
  const isOptional = options.optional || options.default !== void 0;
  if (isOptional && value === void 0) {
    return {
      ok: true,
      value: options.default
    };
  }
  if (!isOptional && value === void 0) {
    return {
      ok: false,
      errors: ["missing"]
    };
  }
  return selectValidator(options)(value);
}

let _getEnv = (key) => process.env[key];
function getEnv$1(...args) {
  return _getEnv(...args);
}
function createInvalidVariablesError(key, type, result) {
  return new AstroError({
    ...EnvInvalidVariables,
    message: EnvInvalidVariables.message(
      invalidVariablesToError([{ key, type, errors: result.errors }])
    )
  });
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-check

// @ts-expect-error
/** @returns {string} */
// used while generating the virtual module
// biome-ignore lint/correctness/noUnusedFunctionParameters: `key` is used by the generated code
// biome-ignore lint/correctness/noUnusedVariables: `key` is used by the generated code
const getEnv = (key) => {
	return getEnv$1(key);
};

const _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === '' ? undefined : rawVariable;
	const options = schema[key];

	const result = validateEnvVariable(variable, options);
	if (result.ok) {
		return result.value;
	}
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};
let DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN = _internalGetSecret("DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN");
let DATOCMS_DRAFT_CONTENT_CDA_TOKEN = _internalGetSecret("DATOCMS_DRAFT_CONTENT_CDA_TOKEN");
_internalGetSecret("DATOCMS_CMA_TOKEN");
_internalGetSecret("SECRET_API_TOKEN");
let SIGNED_COOKIE_JWT_SECRET = _internalGetSecret("SIGNED_COOKIE_JWT_SECRET");

async function executeQuery(query, options) {
  const result = await executeQuery$1(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts ? DATOCMS_DRAFT_CONTENT_CDA_TOKEN : DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN
  });
  return result;
}

const graphql = initGraphQLTada();

const GET_SITE_LOCALES = graphql(`
  query GetSiteLocales {
    _site {
      locales
    }
  }
`);
async function getAvailableLocales() {
  try {
    const result = await executeQuery(GET_SITE_LOCALES);
    return result._site.locales;
  } catch (error) {
    console.error("Error fetching locales from DatoCMS:", error);
    return ["en", "it"];
  }
}
async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0];
}
async function getLocaleSlug(locale, path) {
  const defaultLocale = await getFallbackLocale();
  const slug = path.split("/").filter(Boolean).slice(1).join("/");
  if (locale === defaultLocale) {
    return slug ? `/${slug}` : "/";
  }
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}
async function isValidLocale(locale) {
  const availableLocales = await getAvailableLocales();
  return availableLocales.includes(locale);
}
async function getLocaleFromUrl(url) {
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  const availableLocales = await getAvailableLocales();
  const defaultLocale = await getFallbackLocale();
  if (firstSegment && availableLocales.includes(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}
async function getCurrentLocale(params, url) {
  if (params.locale) {
    const isValid = await isValidLocale(params.locale);
    if (isValid) {
      return params.locale;
    }
  }
  return await getLocaleFromUrl(url);
}

const i18n = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: getAvailableLocales,
  getCurrentLocale,
  getFallbackLocale,
  getLocaleFromUrl,
  getLocaleSlug,
  isValidLocale
}, Symbol.toStringTag, { value: 'Module' }));

const NAVIGATION_QUERY = graphql(`
  query NavigationQuery {
    admin {
      logo {
        url
        alt
        title
      }
      calloutBackground {
        hex
      }
      calloutText
      navLinks {
        ... on MenuDropdownRecord {
          __typename
          staticLabel
          pages {
            label
            page {
              slug
              title
            }
          }
        }
        ... on MenuExternalItemRecord {
          __typename
          label
          url
        }
        ... on MenuItemRecord {
          __typename
          label
          page {
            slug
            title
          }
        }
      }
    }
  }
`);
const FOOTER_QUERY = graphql(`
  query FooterQuery {
    admin {
      logo {
        url
        alt
        title
      }
      footerLinks {
        navLinks {
          ... on MenuExternalItemRecord {
            __typename
            label
            url
          }
          ... on MenuItemRecord {
            __typename
            label
            page {
              slug
            }
          }
        }
        widgetLabel
      }
      legalText {
        value
      }
      socialLinks {
        platform
        url
      }
    }
  }
`);
const ROUTE_MAPPING = {
  Page: "/collection"
  // Add more model mappings as needed
  // 'BlogPost': '/blog',
  // 'Product': '/products',
};
const SOCIAL_ICON_MAPPING = {
  facebook: "tabler:brand-facebook",
  twitter: "tabler:brand-x",
  x: "tabler:brand-x",
  instagram: "tabler:brand-instagram",
  linkedin: "tabler:brand-linkedin",
  youtube: "tabler:brand-youtube",
  tiktok: "tabler:brand-tiktok",
  github: "tabler:brand-github",
  telegram: "tabler:brand-telegram",
  whatsapp: "tabler:brand-whatsapp",
  discord: "tabler:brand-discord",
  rss: "tabler:rss"
};
function buildLocalizedUrl(slug, modelType, locale, defaultLocale) {
  const basePath = ROUTE_MAPPING[modelType];
  return `/${locale}${basePath}/${slug}`;
}
async function transformNavigationData(navData, currentLocale) {
  const defaultLocale = await getFallbackLocale();
  const locale = currentLocale || defaultLocale;
  return navData.admin.navLinks.map((item) => {
    switch (item.__typename) {
      case "MenuDropdownRecord":
        return {
          text: item.staticLabel,
          links: item.pages.map((pageItem) => ({
            text: pageItem.label || pageItem.page.title,
            href: buildLocalizedUrl(pageItem.page.slug, "Page", locale)
          }))
        };
      case "MenuExternalItemRecord":
        return {
          text: item.label,
          href: item.url
        };
      case "MenuItemRecord":
        return {
          text: item.label,
          href: buildLocalizedUrl(item.page.slug, "Page", locale)
        };
      default:
        console.warn("Unknown menu item type:", item.__typename);
        return null;
    }
  }).filter(Boolean);
}
async function transformFooterData(footerData, currentLocale) {
  const defaultLocale = await getFallbackLocale();
  const locale = currentLocale || defaultLocale;
  const links = footerData.admin.footerLinks.map((column) => ({
    title: column.widgetLabel,
    links: column.navLinks.map((item) => {
      switch (item.__typename) {
        case "MenuExternalItemRecord":
          return {
            text: item.label,
            href: item.url
          };
        case "MenuItemRecord":
          return {
            text: item.label,
            href: buildLocalizedUrl(item.page.slug, "Page", locale)
          };
        default:
          return null;
      }
    }).filter(Boolean)
  }));
  const socialLinks = footerData.admin.socialLinks.map((social) => {
    const platform = social.platform.toLowerCase();
    const icon = SOCIAL_ICON_MAPPING[platform];
    return {
      ariaLabel: social.platform,
      href: social.url,
      icon: icon || "tabler:external-link"
    };
  });
  const footNote = footerData.admin.legalText?.value || "";
  return {
    links,
    socialLinks,
    footNote,
    secondaryLinks: []
    // We can add this later if needed
  };
}
async function getNavigationData(currentLocale) {
  try {
    const result = await executeQuery(NAVIGATION_QUERY);
    const navigationData = await transformNavigationData(result, currentLocale);
    return {
      links: navigationData,
      logo: result.admin.logo ? {
        url: result.admin.logo.url,
        alt: result.admin.logo.alt,
        title: result.admin.logo.title
      } : null,
      callout: {
        text: result.admin.calloutText || "",
        backgroundColor: result.admin.calloutBackground?.hex || "#000000"
      }
    };
  } catch (error) {
    console.error("Error fetching navigation data from DatoCMS:", error);
    return {
      links: [],
      logo: null,
      callout: {
        text: "",
        backgroundColor: "#000000"
      }
    };
  }
}
async function getFooterData(currentLocale) {
  try {
    const result = await executeQuery(FOOTER_QUERY);
    const footerData = await transformFooterData(result, currentLocale);
    return {
      ...footerData,
      logo: result.admin.logo ? {
        url: result.admin.logo.url,
        alt: result.admin.logo.alt,
        title: result.admin.logo.title
      } : null
    };
  } catch (error) {
    console.error("Error fetching footer data from DatoCMS:", error);
    return {
      links: [],
      socialLinks: [],
      footNote: "",
      secondaryLinks: [],
      logo: null
    };
  }
}

const $$Astro$3 = createAstro();
const $$Component$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Component$1;
  function trimSlash(path) {
    return path.replace(/^\/+|\/+$/g, "");
  }
  const {
    links: propsLinks
  } = Astro2.props;
  const currentLocale = await getLocaleFromUrl(Astro2.url);
  const currentPath = `/${trimSlash(new URL(Astro2.url).pathname)}`;
  const availableLocales = await Promise.resolve().then(() => i18n).then((m) => m.default());
  const navigationData = await getNavigationData(currentLocale);
  const links = navigationData.links.length > 0 ? navigationData.links : propsLinks || [];
  return renderTemplate`${maybeRenderHead()}<div id="daisy" class="navbar bg-base-100 shadow-sm"> <div class="navbar-start"> <div class="dropdown"> <div tabindex="0" role="button" class="btn btn-ghost lg:hidden"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path> </svg> </div> <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"> ${links.map(({ text, href, links: subLinks }) => renderTemplate`<li> ${subLinks?.length ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <a>${text}</a> <ul class="p-2"> ${subLinks.map(({ text: subText, href: subHref }) => renderTemplate`<li><a${addAttribute(subHref, "href")}>${subText}</a></li>`)} </ul> ` })}` : renderTemplate`<a${addAttribute(href, "href")}${addAttribute(href === currentPath ? "active" : "", "class")}>${text}</a>`} </li>`)} <li> <div class="px-2 py-2"> <div class="text-xs font-medium mb-2 opacity-60">Language</div> <div class="flex flex-wrap gap-1"> ${availableLocales.map((locale) => renderTemplate`<a${addAttribute(Astro2.url.pathname.replace(`/${currentLocale}/`, `/${locale}/`).replace(`/${currentLocale}`, `/${locale}`), "href")}${addAttribute(`btn btn-xs ${locale === currentLocale ? "btn-primary" : "btn-ghost"}`, "class")}> ${locale.toUpperCase()} </a>`)} </div> </div> </li> </ul> </div> <a class="btn btn-ghost text-xl">Logo ${currentLocale}</a> </div> <div class="navbar-center hidden lg:flex"> <ul class="menu menu-horizontal px-1"> ${links.map(({ text, href, links: subLinks }) => renderTemplate`<li> ${subLinks?.length ? renderTemplate`<details> <summary>${text}</summary> <ul class="p-2 bg-base-100 rounded-box shadow"> ${subLinks.map(({ text: subText, href: subHref }) => renderTemplate`<li><a${addAttribute(subHref, "href")}${addAttribute(subHref === currentPath ? "active" : "", "class")}>${subText}</a></li>`)} </ul> </details>` : renderTemplate`<a${addAttribute(href, "href")}${addAttribute(href === currentPath ? "active" : "", "class")}>${text}</a>`} </li>`)} </ul> </div> <div class="navbar-end"> <div class="dropdown dropdown-end"> <div tabindex="0" role="button" class="btn btn-sm btn-ghost"> ${currentLocale.toUpperCase()} <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </div> <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"> ${availableLocales.map((locale) => renderTemplate`<li> <a${addAttribute(Astro2.url.pathname.replace(`/${currentLocale}/`, `/${locale}/`).replace(`/${currentLocale}`, `/${locale}`), "href")}${addAttribute(locale === currentLocale ? "active" : "", "class")}> ${locale.toUpperCase()} </a> </li>`)} </ul> </div> </div> </div>`;
}, "/Users/spleenteo/Sites/spl-cristo/src/components/Header/Component.astro", void 0);

const $$Astro$2 = createAstro();
const $$Component = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Component;
  const currentLocale = await getLocaleFromUrl(Astro2.url);
  const footerData = await getFooterData(currentLocale);
  const { links, socialLinks, footNote, secondaryLinks, logo } = footerData;
  return renderTemplate`${maybeRenderHead()}<footer id="daisy" class="footer bg-base-200 text-base-content p-10"> ${links.map(({ title, links: subLinks }) => renderTemplate`<nav> <h6 class="footer-title">${title}</h6> ${subLinks && Array.isArray(subLinks) && subLinks.map(({ text, href, ariaLabel }) => renderTemplate`<a class="link link-hover"${addAttribute(href, "href")}${addAttribute(ariaLabel, "aria-label")}>${unescapeHTML(text)}</a>`)} </nav>`)} </footer> <footer class="footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4"> <aside class="grid-flow-col items-center"> ${logo ? renderTemplate`<img${addAttribute(logo.url, "src")}${addAttribute(logo.alt || "Logo", "alt")}${addAttribute(logo.title || "Logo", "title")} class="h-12 w-auto">` : renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current"> <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path> </svg>`} <div> <div class="text-sm opacity-60">${unescapeHTML(footNote.content)}</div> ${secondaryLinks.length > 0 && renderTemplate`<div class="text-sm flex gap-2 mt-2"> ${secondaryLinks.map(({ text, href }, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${index !== 0 ? renderTemplate`<span class="opacity-40">·</span>` : ""}<a class="link link-hover"${addAttribute(href, "href")}>${unescapeHTML(text)}</a> ` })}`)} </div>`} </div> </aside> ${socialLinks?.length ? renderTemplate`<nav class="md:place-self-center md:justify-self-end"> <div class="grid grid-flow-col gap-4"> ${socialLinks.map(({ ariaLabel, href, text }) => renderTemplate`<a class="btn btn-ghost btn-square"${addAttribute(ariaLabel, "aria-label")}${addAttribute(href, "href")}>${unescapeHTML(text)}</a>`)} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"> <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path> </svg> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"> <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path> </svg> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"> <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path> </svg> </div> </nav>` : null} </footer>`;
}, "/Users/spleenteo/Sites/spl-cristo/src/components/Footer/Component.astro", void 0);

const TagFragment = graphql(`
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

const DRAFT_MODE_COOKIE_NAME = "__draftMode";

function isDraftModeEnabled(contextOrCookies) {
  const cookies = "cookies" in contextOrCookies ? contextOrCookies.cookies : contextOrCookies;
  const cookie = cookies.get(DRAFT_MODE_COOKIE_NAME);
  if (!cookie) {
    return false;
  }
  try {
    const payload = jwt.verify(cookie.value, SIGNED_COOKIE_JWT_SECRET);
    return payload.enabled;
  } catch (e) {
    return false;
  }
}

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { seo = [] } = Astro2.props;
  const query = graphql(
    /* GraphQL */
    `
    query RootQuery {
     site: _site {
        favicon: faviconMetaTags {
          ...TagFragment
        }
      }
    }
  `,
    [TagFragment]
  );
  const draftModeEnabled = isDraftModeEnabled(Astro2.cookies);
  const result = await executeQuery(query, { includeDrafts: draftModeEnabled });
  return renderTemplate`<html data-theme="coffee"${addAttribute(Astro2.currentLocale, "lang")}> <head>${renderComponent($$result, "Seo", $$Seo, { "data": [...seo, ...result.site.favicon] })}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${renderHead()}</head> <body class="min-h-screen flex flex-col"> ${renderComponent($$result, "Header", $$Component$1, {})} <main class="grow"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Component, {})} </body></html>`;
}, "/Users/spleenteo/Sites/spl-cristo/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { locale } = Astro2.params;
  const query = graphql(
    `
    query HomePageQuery($locale: SiteLocale = en) {
      home(locale: $locale) {
        id
        _publishedAt
        _updatedAt
        title
        subtitle
        seo: _seoMetaTags {
          ...TagFragment
        }
      }
    }
  `,
    [TagFragment]
  );
  const draftModeEnabled = isDraftModeEnabled(Astro2.cookies);
  const { home } = await executeQuery(query, {
    includeDrafts: draftModeEnabled,
    variables: { locale }
  });
  if (!home) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "seo": home.seo }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero bg-base-200"> <div class="hero-content text-center"> <div class="max-w-md"> <h1 class="text-5xl font-bold">${home.title}</h1> <p class="py-6">${home.subtitle}</p> <button class="btn btn-primary"> <a href="https://daisyui.com/components/">Search for components</a> </button> </div> </div> </div> <hr> ` })}`;
}, "/Users/spleenteo/Sites/spl-cristo/src/pages/[locale]/index.astro", void 0);

const $$file = "/Users/spleenteo/Sites/spl-cristo/src/pages/[locale]/index.astro";
const $$url = "/[locale]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
