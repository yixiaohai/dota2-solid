interface CustomGameEventDeclarations {
    c2s_unit_event: {
        event: string;
        units?: EntityIndex[];
    };
    c2s_console_command: {
        command: string
    };
}
