{ pkgs }: {
  deps = [
    pkgs.openssh_gssapi
    pkgs.mailutils
    pkgs.cowsay
  ];
}