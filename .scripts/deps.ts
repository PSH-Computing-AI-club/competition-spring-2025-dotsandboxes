// We want a script file to collect all of the depenedencies we are using
// so that Deno can easily cache them ahead-of-time rather than just-in-time.

import '@cliffy/command';
import '@deno/emit';
import 'source-map-support';
import '@std/assert';
import '@std/log';
import '@std/path';
import '@std/random';
import '@workers/caplink';
