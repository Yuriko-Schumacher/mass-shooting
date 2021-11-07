
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Header.svelte generated by Svelte v3.44.1 */

    const file$2 = "src/Header.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let nav;
    	let div;
    	let input;
    	let t0;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let span2;
    	let t3;
    	let ul;
    	let a0;
    	let li0;
    	let t5;
    	let a1;
    	let li1;
    	let t7;
    	let a2;
    	let li2;
    	let t9;
    	let a3;
    	let li3;
    	let t11;
    	let a4;
    	let li4;
    	let t13;
    	let a5;
    	let li5;
    	let t15;
    	let a6;
    	let li6;

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			span0 = element("span");
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			span2 = element("span");
    			t3 = space();
    			ul = element("ul");
    			a0 = element("a");
    			li0 = element("li");
    			li0.textContent = "Anna Campbell";
    			t5 = space();
    			a1 = element("a");
    			li1 = element("li");
    			li1.textContent = "Sam Chuan";
    			t7 = space();
    			a2 = element("a");
    			li2 = element("li");
    			li2.textContent = "Ryan Corbin";
    			t9 = space();
    			a3 = element("a");
    			li3 = element("li");
    			li3.textContent = "Brennan Kauffman";
    			t11 = space();
    			a4 = element("a");
    			li4 = element("li");
    			li4.textContent = "Sofia Perez Arias";
    			t13 = space();
    			a5 = element("a");
    			li5 = element("li");
    			li5.textContent = "Yuriko Schumacher";
    			t15 = space();
    			a6 = element("a");
    			li6 = element("li");
    			li6.textContent = "Matt Wolfinger";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1ur0wm3");
    			add_location(input, file$2, 7, 3, 215);
    			attr_dev(span0, "class", "svelte-1ur0wm3");
    			add_location(span0, file$2, 11, 3, 306);
    			attr_dev(span1, "class", "svelte-1ur0wm3");
    			add_location(span1, file$2, 12, 3, 318);
    			attr_dev(span2, "class", "svelte-1ur0wm3");
    			add_location(span2, file$2, 13, 3, 330);
    			attr_dev(li0, "class", "svelte-1ur0wm3");
    			add_location(li0, file$2, 16, 6, 456);
    			attr_dev(a0, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/campbell/index.html");
    			attr_dev(a0, "class", "svelte-1ur0wm3");
    			add_location(a0, file$2, 15, 4, 361);
    			attr_dev(li1, "class", "svelte-1ur0wm3");
    			add_location(li1, file$2, 20, 6, 585);
    			attr_dev(a1, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/chuan/index.html");
    			attr_dev(a1, "class", "svelte-1ur0wm3");
    			add_location(a1, file$2, 19, 4, 493);
    			attr_dev(li2, "class", "svelte-1ur0wm3");
    			add_location(li2, file$2, 24, 6, 711);
    			attr_dev(a2, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/corbin/index.html");
    			attr_dev(a2, "class", "svelte-1ur0wm3");
    			add_location(a2, file$2, 23, 4, 618);
    			attr_dev(li3, "class", "svelte-1ur0wm3");
    			add_location(li3, file$2, 28, 6, 841);
    			attr_dev(a3, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/kauffman/index.html");
    			attr_dev(a3, "class", "svelte-1ur0wm3");
    			add_location(a3, file$2, 27, 4, 746);
    			attr_dev(li4, "class", "svelte-1ur0wm3");
    			add_location(li4, file$2, 32, 6, 973);
    			attr_dev(a4, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/perez/index.html");
    			attr_dev(a4, "class", "svelte-1ur0wm3");
    			add_location(a4, file$2, 31, 4, 881);
    			attr_dev(li5, "class", "svelte-1ur0wm3");
    			add_location(li5, file$2, 36, 6, 1111);
    			attr_dev(a5, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/schumacher/index.html");
    			attr_dev(a5, "class", "svelte-1ur0wm3");
    			add_location(a5, file$2, 35, 4, 1014);
    			attr_dev(li6, "class", "svelte-1ur0wm3");
    			add_location(li6, file$2, 40, 6, 1248);
    			attr_dev(a6, "href", "https://mediainnovation.camd.northeastern.edu/2021/masters/wolfinger/index.html");
    			attr_dev(a6, "class", "svelte-1ur0wm3");
    			add_location(a6, file$2, 39, 4, 1152);
    			attr_dev(ul, "id", "menu");
    			attr_dev(ul, "class", "svelte-1ur0wm3");
    			add_location(ul, file$2, 14, 3, 342);
    			attr_dev(div, "id", "menuToggle");
    			attr_dev(div, "class", "svelte-1ur0wm3");
    			add_location(div, file$2, 2, 2, 58);
    			attr_dev(nav, "role", "navigation");
    			attr_dev(nav, "class", "essential-nav svelte-1ur0wm3");
    			add_location(nav, file$2, 1, 1, 10);
    			add_location(header, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, div);
    			append_dev(div, input);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(div, t2);
    			append_dev(div, span2);
    			append_dev(div, t3);
    			append_dev(div, ul);
    			append_dev(ul, a0);
    			append_dev(a0, li0);
    			append_dev(ul, t5);
    			append_dev(ul, a1);
    			append_dev(a1, li1);
    			append_dev(ul, t7);
    			append_dev(ul, a2);
    			append_dev(a2, li2);
    			append_dev(ul, t9);
    			append_dev(ul, a3);
    			append_dev(a3, li3);
    			append_dev(ul, t11);
    			append_dev(ul, a4);
    			append_dev(a4, li4);
    			append_dev(ul, t13);
    			append_dev(ul, a5);
    			append_dev(a5, li5);
    			append_dev(ul, t15);
    			append_dev(ul, a6);
    			append_dev(a6, li6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.44.1 */

    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let p;
    	let t0;
    	let a;
    	let t2;
    	let t3;
    	let h5;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			p = element("p");
    			t0 = text("Produced by students of the Media Innovation masters' program at the ");
    			a = element("a");
    			a.textContent = "Northeastern University School of Journalism.";
    			t2 = text(" © 2021");
    			t3 = space();
    			h5 = element("h5");
    			img = element("img");
    			attr_dev(a, "href", "https://camd.northeastern.edu/journalism-at-northeastern/");
    			set_style(a, "text-decoration", "underline");
    			add_location(a, file$1, 2, 71, 154);
    			set_style(p, "text-align", "center");
    			set_style(p, "padding", "30px 0");
    			set_style(p, "font-family", "'Helvetica'");
    			add_location(p, file$1, 1, 1, 10);
    			if (!src_url_equal(img.src, img_src_value = "https://mediainnovation.camd.northeastern.edu/2021/loveinthetimeofcovid/images/seal_logotype-768x252.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "300px");
    			attr_dev(img, "alt", "Logo of Northeastern University College of Arts, Media and Design");
    			add_location(img, file$1, 9, 2, 405);
    			set_style(h5, "border-top", "none");
    			set_style(h5, "margin-top", "-2%");
    			set_style(h5, "text-align", "center");
    			add_location(h5, file$1, 8, 1, 336);
    			add_location(footer, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p);
    			append_dev(p, t0);
    			append_dev(p, a);
    			append_dev(p, t2);
    			append_dev(footer, t3);
    			append_dev(footer, h5);
    			append_dev(h5, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let h1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let t5;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Which mass shootings matter, and why?";
    			t2 = space();
    			p = element("p");
    			t3 = text("By ");
    			t4 = text(/*name*/ ctx[0]);
    			t5 = space();
    			create_component(footer.$$.fragment);
    			add_location(h1, file, 10, 1, 137);
    			add_location(p, file, 11, 2, 186);
    			attr_dev(main, "class", "svelte-1b6c6sn");
    			add_location(main, file, 9, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t4, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t5);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Header, Footer, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: "Yuriko Schumacher",
    	},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
