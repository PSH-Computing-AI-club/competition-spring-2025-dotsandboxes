// We want a script file to collect all of the depenedencies we are using
// so that Deno can easily cache them ahead-of-time rather than just-in-time.

import '@std/assert';
import '@std/log';
import '@cliffy/command';
